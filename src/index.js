import React from 'react';
import ReactDOM from 'react-dom';
import { Router, useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import { Provider } from 'react-redux';
import store from './store';
import routes from './routes';

const appHistory = useRouterHistory(createHistory)({ queryKey: false });

// load the stylesheet
require('./styles/base.sass');

ReactDOM.render(
  <Provider store={store}>
    <Router routes={routes} history={appHistory} />
  </Provider>,
  document.getElementById('app')
);
