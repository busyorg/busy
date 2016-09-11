module.exports = function(){
	return {
		app: {
			isFetching: false,
			isLoaded: false,
			errorMessage: '',
			sidebarIsVisible: false
		},
		header: {
			menu: 'primary',
			tabs: [],
			query: ''
		},
		pages: {}
	};
};
