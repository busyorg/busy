var Redux = require('redux'),
	appReducer = require('./reducers/app'),
	headerReducer = require('./reducers/header'),
	pagesReducer = require('./reducers/pages'),
	initialState = require('./initialstate'),
	thunk = require('redux-thunk').default;

import authReducers from './auth/authReducers';

const rootReducer = Redux.combineReducers({
	app: appReducer,
	auth: authReducers,
	header: headerReducer,
	pages: pagesReducer
});

module.exports = Redux.applyMiddleware(thunk)(Redux.createStore)(rootReducer,initialState(), window.devToolsExtension && window.devToolsExtension());
