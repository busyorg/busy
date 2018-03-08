import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Logger from 'js-logger';
import { AppContainer } from 'react-hot-loader';
import { message } from 'antd';
import Cookie from 'js-cookie';
import steemConnectAPI from './steemConnectAPI';
import { history } from './routes';
import getStore from './store';
import { loadTranslations } from './translations';
import AppHost from './AppHost';

Logger.useDefaults();

const accessToken = Cookie.get('access_token');
if (accessToken) {
  steemConnectAPI.setAccessToken(accessToken);
}

const store = getStore(steemConnectAPI);

message.config({
  top: 62,
  duration: 3,
});

const render = async Component => {
  await loadTranslations(store);

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
