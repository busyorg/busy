import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Logger from 'js-logger';
import { message } from 'antd';
import Cookie from 'js-cookie';
import steemConnectAPI from './steemConnectAPI';
import history from './history';
import getStore from './store';
import AppHost from './AppHost';
import { getBrowserLocale, loadLanguage } from './translations';
import { setUsedLocale } from './app/appActions';
import { getLocale } from './reducers';

Logger.useDefaults();

if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  navigator.serviceWorker.register('/service-worker.js');
}

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
  const state = store.getState();

  const userLocale = getLocale(state);

  let activeLocale = userLocale;
  if (activeLocale === 'auto') {
    activeLocale = Cookie.get('language') || getBrowserLocale() || 'en-US';
  }

  const lang = await loadLanguage(activeLocale);

  store.dispatch(setUsedLocale(lang));

  ReactDOM.hydrate(
    <Provider store={store}>
      <Component history={history} />
    </Provider>,
    document.getElementById('app'),
  );
};

render(AppHost);
