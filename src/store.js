var Redux = require('redux'),
	headerReducer = require('./reducers/header'),
	pagesReducer = require('./reducers/pages'),
	initialState = require('./initialstate'),
	thunk = require('redux-thunk').default;

import authReducers from './auth/authReducers';
import appReducers from './app/appReducers';

const rootReducer = Redux.combineReducers({
	app: appReducers,
	auth: authReducers,
	header: headerReducer,
	pages: pagesReducer
});

module.exports = Redux.applyMiddleware(thunk)(Redux.createStore)(rootReducer,initialState(), window.devToolsExtension && window.devToolsExtension());
