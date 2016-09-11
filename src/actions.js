var api = require('./steemAPI'),
	C = require('./constants');

module.exports = {
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
