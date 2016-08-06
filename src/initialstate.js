module.exports = function(){
	return {
		app: {
			isFetching: false,
			isLoaded: false,
			errorMessage: ''
		},
		auth: {
			isAuthenticated: false,
			user: {name: 'fabien'}
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