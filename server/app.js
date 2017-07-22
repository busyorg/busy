/* eslint-disable new-cap,global-require,no-param-reassign */
import React from 'react';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';

import getStore from '../src/store';
import routes from '../src/routes';

const fs = require('fs');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const cors = require('cors');
const debug = require('debug')('busy:serverApp');

http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;

const OneWeek = 1000 * 60 * 60 * 24 * 7;

const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);

const rootDir = path.join(__dirname, '..');

if (process.env.NODE_ENV !== 'production') { require('../webpack')(app); }

app.locals.env = process.env;
app.enable('trust proxy');
app.set('view engine', 'ejs');

app.use((req, res, next) => {
  res.io = io;
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(rootDir, 'public'), { maxAge: OneWeek }));
} else {
  app.use(express.static(path.join(rootDir, 'assets')));
}

if (!process.env.IS_BROWSER) { global.window = {}; }

const indexPath = process.env.NODE_ENV === 'production' ?
  `${rootDir}/public/index.html` :
  `${rootDir}/templates/development_index.html`;

const indexHtml = fs.readFileSync(indexPath, 'utf-8');

function fetchComponentData(dispatch, components, params) {
  const needs = components.reduce((prev, current) => (current.needs || [])
    .concat((current.Wrapped ? current.Wrapped.needs : []) || [])
    .concat((current.WrappedComponent ? current.WrappedComponent.needs : []) || [])
    .concat(prev), []);
  const promises = needs.map((need) => {
    const pros = dispatch(need(params));
    // debug('pros', pros);
    return pros;
  });
  debug('promises', needs, Date.now());
  return Promise.all(promises);
}
function renderPage(store, props) {
  debug('renderPage', Date.now());
  const appHtml = renderToString(
    <Provider store={store}>
      <RouterContext {...props} />
    </Provider>);

  const preloadedState = store.getState();
  const helmet = Helmet.renderStatic();
  const header = helmet.meta.toString() + helmet.title.toString() + helmet.link.toString();
  return indexHtml
    .replace('<!--server:header-->', header)
    .replace('<!--server:html-->', appHtml)
    .replace('<!--server:scripts-->',
    `<script>
        // WARNING: See the following for security issues around embedding JSON in HTML:
        // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
        window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
    </script>`
    );
}

function serverSideResponse(req, res) {
  const store = getStore();
  global.postOrigin = `${req.protocol}://${req.get('host')}`;
  match({ routes, location: req.url }, (err, redirect, props) => {
    fetchComponentData(store.dispatch, props.components, props.params)
      .then(() => renderPage(store, props))
      .then(html => res.end(html))
      .catch(() => res.redirect('/404'));
  });
}


app.get('/trending(/:category)', serverSideResponse);
app.get('/hot(/:category)', serverSideResponse);
app.get('/cashout(/:category)', serverSideResponse);
app.get('/created(/:category)', serverSideResponse);
app.get('/active(/:category)', serverSideResponse);
app.get('/responses(/:category)', serverSideResponse);
app.get('/votes(/:category)', serverSideResponse);

app.get('/@:name/posts', serverSideResponse);
app.get('/@:name/feed', serverSideResponse);
app.get('/@:name/replies', serverSideResponse);
app.get('/@:name', serverSideResponse);

app.get('/:category/@:author/:permlink', serverSideResponse);
app.get('/*', (req, res) => {
  res.send(indexHtml);
});

module.exports = { app, server };
