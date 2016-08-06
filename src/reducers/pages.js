var C = require("../constants"),
	initialState = require("../initialstate");

module.exports = function(state,action){
	switch(action.type){
		case C.FEED_REQUEST:
			return Object.assign({}, state, {
				current: Object.assign({}, state.current, action)
			});
		case C.FEED_SUCCESS:
			return Object.assign({}, state, {
				current: Object.assign({}, state.current, action)
			});
		case C.FEED_CLEAR:
			return Object.assign({}, state, {
				current: Object.assign({}, state.current, action)
			});
		case C.CONTENT_REQUEST:
			return Object.assign({}, state, {
				single: Object.assign({}, state.single, action)
			});
		case C.CONTENT_SUCCESS:
			return Object.assign({}, state, {
				single: Object.assign({}, state.single, action)
			});
		case C.ACCOUNT_REQUEST:
			return Object.assign({}, state, {
				profile: Object.assign({}, state.profile, action)
			});
		case C.ACCOUNT_SUCCESS:
			return Object.assign({}, state, {
				profile: Object.assign({}, state.profile, action)
			});
		default: return state || initialState().pages;
	}
};