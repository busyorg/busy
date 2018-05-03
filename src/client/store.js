import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { applyMiddleware, createStore, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import steemAPI from './steemAPI';
import { history } from './routes';
import errorMiddleware from './errorMiddleware';
import reducers from './reducers';

export default steemConnectAPI => {
  let preloadedState;
  if (typeof window !== 'undefined') {
    /* eslint-disable no-underscore-dangle */
    preloadedState = window.__PRELOADED_STATE__;
    delete window.__PRELOADED_STATE__;
    /* eslint-enable no-underscore-dangle */
  }

  const middleware = [
    errorMiddleware,
    promiseMiddleware({
      promiseTypeSuffixes: ['START', 'SUCCESS', 'ERROR'],
    }),
    thunk.withExtraArgument({
      steemAPI,
      steemConnectAPI,
    }),
    routerMiddleware(history),
  ];

  let enhancer;
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-underscore-dangle
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(...middleware));
  } else {
    enhancer = compose(applyMiddleware(...middleware));
  }

  const store = createStore(reducers, preloadedState, enhancer);
  return store;
};
