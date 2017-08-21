import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import steemconnect from 'sc2-sdk';
import Cookie from 'js-cookie';
import steem from 'steem';
import ReactGA from 'react-ga';
import Raven from 'raven-js';
import Logger from 'js-logger';
import { AppContainer } from 'react-hot-loader';
import { LocaleProvider, message } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import { history } from './routes';
import getStore from './store';
import AppHost from './AppHost';

Logger.useDefaults();

const store = getStore();

ReactGA.initialize('UA-87507611-1');
const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};

if (process.env.SENTRY_PUBLIC_DSN) {
  Raven.config(process.env.SENTRY_PUBLIC_DSN).install();
}

if (process.env.STEEMCONNECT_HOST) {
  steemconnect.init({
    app: 'busy.app',
    callbackURL: process.env.STEEMCONNECT_REDIRECT_URL,
  });
  const accessToken = Cookie.get('access_token');
  steemconnect.setBaseURL(process.env.STEEMCONNECT_HOST);
  if (accessToken) {
    steemconnect.setAccessToken(accessToken);
  }
}

steem.api.setOptions({ transport: 'http' });
if (process.env.STEEMJS_URL) {
  steem.api.setOptions({ url: process.env.STEEMJS_URL });
}

message.config({
  top: 62,
  duration: 3,
});

const render = (Component) => {
  ReactDOM.render(
    <Provider store={store}>
      <LocaleProvider locale={enUS}>
        {process.env.NODE_ENV !== 'production' ?
          <AppContainer>
            <Component
              history={history}
              onUpdate={logPageView}
            />
          </AppContainer>
          :
          <Component
            history={history}
            onUpdate={logPageView}
          />
        }
      </LocaleProvider>
    </Provider>,
    document.getElementById('app'),
  );
};

render(AppHost);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./AppHost', () => { render(AppHost); });
}
