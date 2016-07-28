var Redux = require("redux"),
	authReducer = require("./reducers/auth"),
	headerReducer = require("./reducers/header"),
	tabsReducer = require("./reducers/tabs"),
	pagesReducer = require("./reducers/pages"),
	modalReducer = require("./reducers/modal"),
	initialState = require("./initialstate"),
	thunk = require('redux-thunk').default;

var rootReducer = Redux.combineReducers({
	auth: authReducer,
	header: headerReducer,
	tabs: tabsReducer,
	pages: pagesReducer,
	modal: modalReducer
});

module.exports = Redux.applyMiddleware(thunk)(Redux.createStore)(rootReducer,initialState(), window.devToolsExtension && window.devToolsExtension());