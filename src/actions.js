var axios = require('axios'),
	moment = require('moment'),
	C = require('./constants');

module.exports = {
	login: function(name, password) {
		return function(dispatch, getState) {
			var req = {type: C.LOGIN_REQUEST};
			Object.assign(req);
			dispatch(req);
			axios.get('//api.steemjs.com/getAccounts?names[]=' + name)
				.then(response => {
					var res = {
						type: C.LOGIN_SUCCESS,
						user: response.data[0],
					};
					Object.assign(res);
					dispatch(res);
				});
		};
	},
	getConfig: function() {
		return function(dispatch, getState) {
			var req = {type: C.CONFIG_REQUEST};
			Object.assign(req);
			dispatch(req);
			axios.get('//api.steemjs.com/getConfig')
				.then(response => {
					var res = {
						type: C.CONFIG_SUCCESS,
						config: response.data,
					};
					Object.assign(res);
					dispatch(res);
				});
		};
	},
	getFeed: function(path, options) {
		return function(dispatch, getState) {
			var req = {type: C.FEED_REQUEST, path: path};
			Object.assign(req, options);
			dispatch(req);
			axios.get('//api.steemjs.com/getState?path=' + options.path)
				.then(response => {
					var res = {
						type: C.FEED_SUCCESS,
						path: path,
						isFetching: false,
						isLoaded: true,
						current_route: response.data.current_route,
						categories: response.data.categories,
						content: response.data.content,
						feed_price: response.data.feed_price,
					};
					Object.assign(res, options);
					dispatch(res);
				});
		};
	},
	clearFeed: function(path, options) {
		return function(dispatch, getState) {
			var req = {
				type: C.FEED_CLEAR,
				path: path,
				isFetching: true,
				isLoaded: false,
				current_route: null,
				content: [],
			};
		};
	},
	showModal: function(page) {
		return function(dispatch, getState) {
			dispatch({type:C.SHOW_MODAL, page: page});
		};
	},
	hideModal: function() {
		return function(dispatch, getState) {
			dispatch({type:C.HIDE_MODAL});
		};
	},
	refresh: function(a) {
		return function(dispatch, getState) {
			dispatch({type:C.REFRESH});
		};
	},
	search: function(query) {
		query = query || '';
		return function(dispatch, getState) {
			dispatch({type:C.SEARCH, query: query});
		};
	},
	setMenu: function(menu) {
		return function(dispatch, getState) {
			dispatch({type:C.SET_MENU, menu: menu});
		};
	},
	createTab: function(page) {
		return function(dispatch, getState) {
			dispatch({type:C.TAB_CREATE, page: page});
		};
	},
	deleteTab: function(page) {
		return function(dispatch, getState) {
			dispatch({type:C.TAB_DELETE, page: page});
		};
	}
};