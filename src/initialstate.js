var moment = require('moment'),
	C = require("./constants");

module.exports = function(){
	return {
		auth: {
			isFetching: false,
			isAuthenticated: false,
			errorMessage: '',
			user: [],
			range: {
				from: moment().startOf('day').utcOffset(0).format(),
				to: moment().add(1, 'day').startOf('day').utcOffset(0).format(),
				period: 'today'
			}
		},
		modal: {
			isVisible: false,
			isFetching: false
		},
		pages: {},
		header: {
			menu: 'primary',
			query: ''
		},
		tabs: []
	};
};