var C = require("../constants"),
	initialState = require("../initialstate");

module.exports = function(state,action){
	switch(action.type){
		case C.FEED_REQUEST:
			return Object.assign({}, state, {
				isFetching: true,
				isLoaded: false
			});
		case C.FEED_SUCCESS:
			return Object.assign({}, state, {
				isFetching: false,
				isLoaded: true
			});
		case C.FEED_FAILURE:
			return Object.assign({}, state, {
				isFetching: false,
				isLoaded: true
			});
		case C.CONFIG_SUCCESS:
			return Object.assign({}, state, {
				config: action.config
			});
		default: return state || initialState().app;
	}
};