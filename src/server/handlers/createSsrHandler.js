import React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { matchRoutes, renderRoutes } from 'react-router-config';
import url from 'url';
import Raven from 'raven-js';

import sc2 from 'sc2-sdk';
import getStore from '../../client/store';
import routes from '../../common/routes';
import renderSsrPage from '../renderers/ssrRenderer';
import { setAppUrl, setUsedLocale } from '../../client/app/appActions';
import { getLocale } from '../../client/reducers';

import { getAvailableLocale } from '../../client/translations';
import translations from '../translations';

export default function createSsrHandler(template) {
  return function serverSideResponse(req, res) {
    const api = sc2.Initialize({
      app: process.env.STEEMCONNECT_CLIENT_ID,
      baseURL: process.env.STEEMCONNECT_HOST,
      callbackURL: process.env.STEEMCONNECT_REDIRECT_URL,
    });

    if (req.cookies.access_token) {
      api.setAccessToken(req.cookies.access_token);
    }

    const appUrl = url.format({
      protocol: req.protocol,
      host: req.get('host'),
    });

    const store = getStore(api);
    store.dispatch(setAppUrl(appUrl));

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
        const state = store.getState();
        const availableLocale = getAvailableLocale(getLocale(state));

        global.translations = translations[availableLocale];
        store.dispatch(setUsedLocale(availableLocale));

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
        res.send(renderSsrPage(store, content, template, appUrl !== 'https://busy.org'));
      })
      .catch((err) => {
        Raven.captureException(err);
        console.error('SSR error occured, falling back to bundled application instead', err); // eslint-disable-line no-console
        res.send(template);
      });
  };
}
