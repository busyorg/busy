var api = require('./steemAPI');

import * as appTypes from './app/appActionTypes';

module.exports = {
	getConfig: function() {
		return function(dispatch, getState) {
			var req = {type: appTypes.CONFIG_REQUEST};
			dispatch(req);
			api.getConfig(function(err, config) {
				var res = {
					type: appTypes.CONFIG_SUCCESS,
					config: config,
				};
				dispatch(res);
			});
		};
	},
	showSidebar: function() {
		return function(dispatch, getState) {
			dispatch({type: appTypes.SHOW_SIDEBAR});
		};
	},
	hideSidebar: function() {
		return function(dispatch, getState) {
			dispatch({type: appTypes.HIDE_SIDEBAR});
		};
	},
	setMenu: function(menu) {
		return function(dispatch, getState) {
			dispatch({type: appTypes.SET_MENU, menu: menu});
		};
	}
};
