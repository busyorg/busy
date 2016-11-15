import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory, applyRouterMiddleware } from 'react-router';
import { Provider } from 'react-redux';
import steemconnect from 'steemconnect';
import {
  useHistoryRestoreScroll,
  useRouterRestoreScroll
} from 'react-router-restore-scroll';
import routes from './routes';
import store from './store';
import { isSmall } from './helpers/responsive';

if (process.env.SENTRY_PUBLIC_DSN) {
  const Raven = require('raven-js');
  Raven
    .config(process.env.SENTRY_PUBLIC_DSN)
    .install();
}

if (process.env.STEEMCONNECT_HOST) {
  steemconnect.setBaseUrl(process.env.STEEMCONNECT_HOST);
  steemconnect.setApp('busy.app');
}

const createHistory = useHistoryRestoreScroll(() => browserHistory);

browserHistory.listen(() => {
  if (isSmall()) {
    store.dispatch({
      type: 'HIDE_SIDEBAR',
    });
  }
});

const routerRender = applyRouterMiddleware(
  useRouterRestoreScroll()
);

// load the stylesheet
require('./styles/base.sass');

ReactDOM.render(
  <Provider store={store}>
    <Router
      routes={routes}
      history={createHistory()}
      render={routerRender}
    />
  </Provider>,
  document.getElementById('app')
);
