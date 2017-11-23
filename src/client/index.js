import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import steem from 'steem';
import Raven from 'raven-js';
import Logger from 'js-logger';
import { AppContainer } from 'react-hot-loader';
import { message } from 'antd';
import { history } from './routes';
import getStore from './store';
import AppHost from './AppHost';

Logger.useDefaults();

const store = getStore();

if (process.env.SENTRY_PUBLIC_DSN) {
  Raven.config(process.env.SENTRY_PUBLIC_DSN).install();
}

if (process.env.STEEMJS_URL) {
  steem.api.setOptions({ url: process.env.STEEMJS_URL });
}

message.config({
  top: 62,
  duration: 3,
});

const render = (Component) => {
  ReactDOM.hydrate(
    <Provider store={store}>
      {process.env.NODE_ENV !== 'production' ? (
        <AppContainer>
          <Component history={history} />
        </AppContainer>
      ) : (
        <Component history={history} />
      )}
    </Provider>,
    document.getElementById('app'),
  );
};

render(AppHost);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./AppHost', () => {
    render(AppHost);
  });
}
