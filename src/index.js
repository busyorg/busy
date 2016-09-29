import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory, applyRouterMiddleware } from 'react-router';
import { Provider } from 'react-redux';
import store from './store';
import routes from './routes';
import api from './steemAPI';
import {
  useHistoryRestoreScroll,
  useRouterRestoreScroll
} from 'react-router-restore-scroll';

const createHistory = useHistoryRestoreScroll(() => browserHistory);

const routerRender = applyRouterMiddleware(
  useRouterRestoreScroll()
);

// load the stylesheet
require('./styles/base.sass');

window.steemAPI = api;

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
