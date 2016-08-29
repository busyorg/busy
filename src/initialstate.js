module.exports = function(){
	return {
		app: {
			isFetching: false,
			isLoaded: false,
			errorMessage: '',
			sidebarIsVisible: false
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