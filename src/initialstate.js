module.exports = function(){
	return {
		app: {
			isFetching: false,
			isLoaded: false,
			errorMessage: '',
			sidebarIsVisible: true
		},
		auth: {
			isAuthenticated: false,
			user: {},
			following: []
		},
		header: {
			menu: 'primary',
			tabs: [],
			query: ''
		},
		pages: {}
	};
};