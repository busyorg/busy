var C = require("../constants"),
	initialState = require("../initialstate"),
	sortBy = require("sort-by");

module.exports = function(state,action){
	switch(action.type){
		case C.FEED_REQUEST:
			return Object.assign({}, state, {current: action});
		case C.FEED_SUCCESS:
			return Object.assign({}, state, {current: action});
		default: return state || initialState().pages;
	}
};