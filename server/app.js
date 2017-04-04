/* eslint-disable new-cap,global-require,no-param-reassign */
import React from 'react';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { applyMiddleware, createStore, compose } from 'redux';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { Provider } from 'react-redux';
import api from '../src/steemAPI';

import reducers from '../src/reducers';
import routes from '../src/routes';

const fs = require('fs');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const cors = require('cors');

http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;

const OneWeek = 1000 * 60 * 60 * 24 * 7;

const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);

const rootDir = path.join(__dirname, '..');

if (process.env.NODE_ENV !== 'production') { require('../webpack')(app); }

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
  app.use(express.static(path.join(rootDir, 'public'), {
    maxAge: OneWeek,
  }));
} else {
  app.use(express.static(path.join(rootDir, 'assets')));
}
app.use(express.static(path.join(rootDir, 'node_modules')));

app.locals.env = process.env;
if (!process.env.IS_BROWSER) { global.window = {}; }

const indexPath = process.env.NODE_ENV === 'production' ?
  `${rootDir}/public/index.html` :
  `${rootDir}/templates/development_index.html`;

const indexHtml = fs.readFileSync(indexPath, 'utf-8');

function renderPage(appHtml, preloadedState) {
  return indexHtml
    .replace('<!--server:html-->', appHtml)
    .replace('<!--server:scripts-->',
    `<script>
        // WARNING: See the following for security issues around embedding JSON in HTML:
        // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
        window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
    </script>`
    );
}

app.get('/*', (req, res) => {
  match({ routes, location: req.url }, (err, redirect, props) => {
    const middleware = [
      promiseMiddleware({ promiseTypeSuffixes: ['START', 'SUCCESS', 'ERROR'] }),
      thunk.withExtraArgument({ steemAPI: api })
    ];
    const store = createStore(reducers, compose(applyMiddleware(...middleware)));

    const appHtml = renderToString(
      <Provider store={store}>
        <RouterContext {...props} />
      </Provider>);

    const preloadedState = store.getState();

    res.send(renderPage(appHtml, preloadedState));
  });
});

module.exports = { app, server };
