var steem = require('./../lib/steem'),
	C = require('./constants');

module.exports = {
	login: function(username) {
		return function(dispatch, getState) {
			var req = {type: C.LOGIN_REQUEST};
			Object.assign(req);
			dispatch(req);
			steem.getAccount(username, function(err, user) {
				var res = {
					type: C.LOGIN_SUCCESS,
					user: user,
				};
				Object.assign(res);
				dispatch(res);
			});
		}.bind(this);
	},
	getAccount: function(name) {
		return function(dispatch, getState) {
			var req = {type: C.ACCOUNT_REQUEST};
			Object.assign(req);
			dispatch(req);
			steem.getAccount(name, function(err, account) {
				var res = {
					type: C.ACCOUNT_SUCCESS,
					account: account,
				};
				Object.assign(res);
				dispatch(res);
			});
		};
	},
	getContent: function(author, permlink) {
		return function(dispatch, getState) {
			var req = {type: C.CONTENT_REQUEST};
			Object.assign(req);
			dispatch(req);
			steem.getContent(author, permlink, function(err, content) {
				var res = {
					type: C.CONTENT_SUCCESS,
					content: content,
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
			steem.getConfig(function(err, config) {
				var res = {
					type: C.CONFIG_SUCCESS,
					config: config,
				};
				Object.assign(res);
				dispatch(res);
			});
		};
	},
	showSidebar: function() {
		return function(dispatch, getState) {
			dispatch({type:C.SHOW_SIDEBAR});
		};
	},
	hideSidebar: function() {
		return function(dispatch, getState) {
			dispatch({type:C.HIDE_SIDEBAR});
		};
	},
	setMenu: function(menu) {
		return function(dispatch, getState) {
			dispatch({type:C.SET_MENU, menu: menu});
		};
	}
};