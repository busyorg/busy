/* eslint-disable no-console */
import React from 'react';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { matchRoutes, renderRoutes } from 'react-router-config';
import Raven from 'raven-js';

import sc2 from 'sc2-sdk';
import getStore from '../client/store';
import routes from '../common/routes';

const fs = require('fs');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http');
const https = require('https');
const steem = require('steem');

http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;

const OneWeek = 1000 * 60 * 60 * 24 * 7;

const app = express();
const server = http.Server(app);

const rootDir = path.join(__dirname, '../..');

if (process.env.STEEMJS_URL) {
  steem.api.setOptions({ url: process.env.STEEMJS_URL });
}

if (process.env.SENTRY_PUBLIC_DSN) {
  Raven.config(process.env.SENTRY_PUBLIC_DSN).install();
}

app.locals.env = process.env;
app.enable('trust proxy');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(rootDir, 'public'), { maxAge: OneWeek, index: false }));
} else {
  app.use(express.static(path.join(rootDir, 'public'), { index: false }));
}

const indexPath = `${rootDir}/public/index.html`;

const indexHtml = fs.readFileSync(indexPath, 'utf-8');

function renderPage(store, html) {
  const preloadedState = store.getState();
  const helmet = Helmet.renderStatic();
  const header = helmet.meta.toString() + helmet.title.toString() + helmet.link.toString();
  return indexHtml
    .replace('<!--server:header-->', header)
    .replace('<!--server:html-->', html)
    .replace(
      '<!--server:scripts-->',
      `<script>
        // WARNING: See the following for security issues around embedding JSON in HTML:
        // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
        window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
    </script>`,
    );
}

function serverSideResponse(req, res) {
  const api = sc2.Initialize({
    app: process.env.STEEMCONNECT_CLIENT_ID,
    baseURL: process.env.STEEMCONNECT_HOST,
    callbackURL: process.env.STEEMCONNECT_REDIRECT_URL,
  });

  if (req.cookies.access_token) {
    api.setAccessToken(req.cookies.access_token);
  }

  const store = getStore(api);

  const branch = matchRoutes(routes, req.url);
  const promises = branch.map(({ route, match }) => {
    const fetchData = route.component.fetchData;
    if (fetchData instanceof Function) {
      return fetchData(store, match);
    }
    return Promise.resolve(null);
  });

  return Promise.all(promises)
    .then(() => {
      const context = {};
      const content = renderToString(
        <Provider store={store}>
          <StaticRouter location={req.url} context={context}>
            {renderRoutes(routes)}
          </StaticRouter>
        </Provider>,
      );

      res.send(renderPage(store, content));
    })
    .catch((err) => {
      Raven.captureException(err);
      console.error('SSR error occured, falling back to bundled application instead', err);
      res.send(indexHtml);
    });
}

app.get('/callback', (req, res) => {
  const accessToken = req.query.access_token;
  const expiresIn = req.query.expires_in;
  const state = req.query.state;
  const next = state && state[0] === '/' ? state : '/';
  if (accessToken && expiresIn) {
    res.cookie('access_token', accessToken, { maxAge: expiresIn * 1000 });
    res.redirect(next);
  } else {
    res.status(401).send({ error: 'access_token or expires_in Missing' });
  }
});

app.get('/i/@:referral', (req, res) => {
  const { referral } = req.params;
  steem.api.getAccountsAsync([referral]).then((accounts) => {
    if (accounts[0]) {
      res.cookie('referral', referral, { maxAge: 86400 * 30 * 1000 });
      res.redirect('/');
    }
  }).catch(() => {
    res.redirect('/');
  });
});

app.get('/i/:parent/@:referral/:permlink', (req, res) => {
  const { parent, referral, permlink } = req.params;
  steem.api.getContentAsync(referral, permlink).then((content) => {
    if (content.author) {
      res.cookie('referral', referral, { maxAge: 86400 * 30 * 1000 });
      res.redirect(`/${parent}/@${referral}/${permlink}`);
    } else {
      res.redirect('/');
    }
  }).catch(() => {
    res.redirect('/');
  });
});

app.get('/*', serverSideResponse);

module.exports = { app, server };
