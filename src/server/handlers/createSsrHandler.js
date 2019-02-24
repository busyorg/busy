import { setTimeout } from 'timers';
import React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { matchRoutes, renderRoutes } from 'react-router-config';

import sc2 from 'sc2-sdk';
import getStore from '../../client/store';
import routes from '../../common/routes';
import renderSsrPage from '../renderers/ssrRenderer';

// eslint-disable-next-line import/no-dynamic-require
const assets = require(process.env.MANIFEST_PATH);

const ssrTimeout = 5000;

function createTimeout(timeout, promise) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(`Request has timed out. It should take no longer than ${timeout}ms.`));
    }, timeout);
    promise.then(resolve, reject);
  });
}

export default function createSsrHandler(template) {
  return async function serverSideResponse(req, res) {
    try {
      const api = sc2.Initialize({
        app: process.env.STEEMCONNECT_CLIENT_ID,
        baseURL: process.env.STEEMCONNECT_HOST,
        callbackURL: process.env.STEEMCONNECT_REDIRECT_URL,
      });

      if (req.cookies.access_token) {
        api.setAccessToken(req.cookies.access_token);
      }

      const store = getStore(api);

      const branch = matchRoutes(routes, req.url.split('?')[0]);
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

      return res.send(renderSsrPage(store, content, assets, template, req.hostname !== 'busy.org'));
    } catch (err) {
      console.error('SSR error occured, falling back to bundled application instead', err);
      return res.send(renderSsrPage(null, null, assets, template, req.hostname !== 'busy.org'));
    }
  };
}
