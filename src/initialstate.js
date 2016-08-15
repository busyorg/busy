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
		modal: {
			isVisible: false
		},
		header: {
			menu: 'primary',
			tabs: [],
			query: ''
		},
		pages: {
			current: {
				isFetching: false,
				isLoaded: false
			},
			single: {
				isFetching: false,
				isLoaded: false
			},
			profile: {
				isFetching: false,
				isLoaded: false
			}
		}
	};
};