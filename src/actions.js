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