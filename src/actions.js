var api = require('./steem'),
	C = require('./constants');

module.exports = {
	login: function(username) {
		return function(dispatch, getState) {
			var req = {type: C.LOGIN_REQUEST};
			dispatch(req);
			api.getAccounts([username], function(err, users) {
				var res = {
					type: C.LOGIN_SUCCESS,
					user: users[0],
				};
				Object.assign(res);
				dispatch(res);
			});
		}.bind(this);
	},
	getConfig: function() {
		return function(dispatch, getState) {
			var req = {type: C.CONFIG_REQUEST};
			dispatch(req);
			api.getConfig(function(err, config) {
				var res = {
					type: C.CONFIG_SUCCESS,
					config: config,
				};
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