var C = require("../constants"),
	initialState = require("../initialstate"),
	sortBy = require("sort-by");

module.exports = function(state,action){
	switch(action.type){
		case C.FEED_REQUEST:
			return Object.assign({}, state, {
				current: action,
				path: action.path,
				isFetching: true,
				isLoaded: false,
				current_route: null,
				content: [],
			});
		case C.FEED_SUCCESS:
			return Object.assign({}, state, {current: action});
		case C.FEED_CLEAR:
			return Object.assign({}, state, {
				current: action,
				path: action.path,
				isFetching: false,
				isLoaded: false,
				current_route: null,
				content: [],
			});
		default: return state || initialState().pages;
	}
};