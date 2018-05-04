import express from 'express';
import React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { setTimeout } from 'timers';
import cookieParser from 'cookie-parser';

import sc2 from 'sc2-sdk';
import getStore from '../client/store';
import routes from '../common/routes';

// eslint-disable-next-line import/no-unresolved
const assets = require('../../build/assets.json');

const getHTML = (content, state, pageAssets) => `<!DOCTYPE html>
<html>
  <head>
    <title>Busy</title>
    <meta charset="UTF-8">
    <meta name="description" content="Busy is a decentralized social network based on Steem blockchain">
    <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="stylesheet" href="${pageAssets.vendor.css}" />
    <link rel="stylesheet" href="${pageAssets.main.css}" />
  </head>
  <body>
  <div id="app">${content}</div>
  <script src="${pageAssets.vendor.js}" defer></script>
  <script src="${pageAssets.main.js}" defer></script>
  <script>
    window.__PRELOADED_STATE__ =  ${JSON.stringify(state)
      .replace(/\u2028/g, '\\n')
      .replace(/</g, '\\u003c')}
  </script>
  </body>
</html>
`;

const ssrTimeout = 5000;

function createTimeout(timeout, promise) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(`Request has timed out. It should take no longer than ${timeout}ms.`));
    }, timeout);
    promise.then(resolve, reject);
  });
}

const app = express();

app.use(cookieParser());
app.use(express.static(process.env.ASSETS_PATH));

app.get('/*', async (req, res) => {
  const api = sc2.Initialize({
    app: process.env.STEEMCONNECT_CLIENT_ID,
    baseURL: process.env.STEEMCONNECT_HOST,
    callbackURL: process.env.STEEMCONNECT_REDIRECT_URL,
  });

  if (req.cookies && req.cookies.access_token) {
    api.setAccessToken(req.cookies.access_token);
  }

  const store = getStore(api);

  const branch = matchRoutes(routes, req.url);
  const promises = branch.map(({ route, match }) => {
    const fetchData = route.component.fetchData;
    if (fetchData instanceof Function) {
      return fetchData({ store, match, req, res });
    }
    return Promise.resolve(null);
  });

  await createTimeout(ssrTimeout, Promise.all(promises));

  if (res.headersSent) return null;

  const context = {};
  const content = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={context}>
        {renderRoutes(routes)}
      </StaticRouter>
    </Provider>,
  );
  if (context.status) {
    res.status(context.status);
  }

  return res.status(200).send(getHTML(content, store.getState(), assets));
});

export default app;
