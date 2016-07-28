var axios = require('axios'),
	moment = require("moment"),
	$ = require('jquery'),
	C = require("./constants");

module.exports = {
	loginUser: function(creds) {
		return function(dispatch, getState) {
			dispatch({type: C.LOGIN_REQUEST});
			axios.get('/api/auth')
				.then(response => {
					dispatch({type: C.LOGIN_SUCCESS, user: response.data});
				});
		};
	},
	getEntry: function(page, options) {
		return function(dispatch, getState) {
			var req = {type: C.ENTRY_REQUEST, page: page};
			Object.assign(req, options);
			dispatch(req);
			axios.get('/api/' + options.slug + '/' + options.id)
				.then(response => {
					var res = {
						type: C.ENTRY_SUCCESS,
						page: page,
						entry: response.data.entry
					};
					Object.assign(res, options);
					dispatch(res);
				});
		};
	},
	getFeed: function(page, options) {
		return function(dispatch, getState) {
			var req = {type: C.REPORT_REQUEST, page: page};
			Object.assign(req, options);
			dispatch(req);
			axios.get('//api.steemjs.com/getState?' + $.param(options))
				.then(response => {
					var res = {
						type: C.REPORT_SUCCESS,
						page: page,
						current_route: response.data.current_route,
						catagories: response.data.catagories,
						content: response.data.content,
						feed_price: response.data.feed_price,
					};
					Object.assign(res, options);
					dispatch(res);
				});
		};
	},
	setTitle: function(page, title) {
		return function(dispatch, getState) {
			dispatch({type:C.SET_TITLE, page: page, title: title});
		};
	},
	setIcon: function(page, icon) {
		return function(dispatch, getState) {
			dispatch({type:C.SET_ICON, page: page, icon: icon});
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
	setRange: function(from, to, period) {
		return function(dispatch, getState) {
			dispatch({type:C.SET_RANGE, from: from, to: to, period: period});
		};
	},
	setPeriod: function(period) {
		var from = '';
		var to = '';
		switch(period) {
			case 'today':
				from = moment().startOf('day');
				to = moment().add(1, 'day').startOf('day');
				break;
			case 'yesterday':
				from = moment().subtract(1, 'day').startOf('day');
				to = moment().startOf('day');
				break;
			case 'last-7-days':
				from = moment().subtract(6, 'days').startOf('day');
				to = moment().add(1, 'day').startOf('day');
				break;
			case 'last-30-days':
				from = moment().subtract(1, 'month').add(1, 'day').startOf('day');
				to = moment().add(1, 'day').startOf('day');
				break;
			case 'this-month':
				from = moment().startOf('month');
				to = moment().add(1, 'day').startOf('day');
				break;
			case 'last-month':
				from = moment().subtract(1, 'month').startOf('month');
				to = moment().subtract(1, 'month').endOf('month').add(1, 'day').startOf('day');
				break;
			default:
				break;
		}
		if (from && to) {
			return this.setRange(from.utcOffset(0).format(), to.utcOffset(0).format(), period);
		}
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