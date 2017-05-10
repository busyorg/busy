import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import steemconnect from 'sc2-sdk';
import Cookie from 'js-cookie';
import ReactGA from 'react-ga';
import { AppContainer } from 'react-hot-loader';
import store from './store';
import { isSmall } from './helpers/responsive';
import { HIDE_SIDEBAR } from './actions';
import AppHost from './AppHost';

ReactGA.initialize('UA-87507611-1');
const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};

if (process.env.SENTRY_PUBLIC_DSN) {
  const Raven = require('raven-js');
  Raven.config(process.env.SENTRY_PUBLIC_DSN).install();
}

if (process.env.STEEMCONNECT_HOST) {
  steemconnect.init({
    app: 'busy.app',
    callbackURL: process.env.STEEMCONNECT_REDIRECT_URL
  });
  const accessToken = Cookie.get('access_token');
  steemconnect.setBaseURL(process.env.STEEMCONNECT_HOST);
  if (accessToken) {
    steemconnect.setAccessToken(accessToken);
  }
}

browserHistory.listen(() => {
  if (isSmall()) {
    store.dispatch({
      type: HIDE_SIDEBAR,
    });
  }
});

const render = (Component) => {
  ReactDOM.render(
    <Provider store={store}>
      {process.env.NODE_ENV !== 'production' ?
        <AppContainer>
          <Component
            onUpdate={logPageView}
            history={browserHistory}
          />
        </AppContainer>
        :
        <Component
          onUpdate={logPageView}
          history={browserHistory}
        />
      }
    </Provider>,
    document.getElementById('app')
  );
};

render(AppHost);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./AppHost', () => { render(AppHost); });
}
