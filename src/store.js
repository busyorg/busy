var Redux = require("redux"),
	appReducer = require("./reducers/app"),
	authReducer = require("./reducers/auth"),
	headerReducer = require("./reducers/header"),
	pagesReducer = require("./reducers/pages"),
	modalReducer = require("./reducers/modal"),
	initialState = require("./initialstate"),
	thunk = require('redux-thunk').default;

var rootReducer = Redux.combineReducers({
	app: appReducer,
	auth: authReducer,
	header: headerReducer,
	pages: pagesReducer,
	modal: modalReducer
});

module.exports = Redux.applyMiddleware(thunk)(Redux.createStore)(rootReducer,initialState(), window.devToolsExtension && window.devToolsExtension());