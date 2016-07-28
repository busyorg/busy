var C = require("../constants"),
	initialState = require("../initialstate");

module.exports = function(state,action){
	switch(action.type){
		case C.SEARCH:
			return Object.assign({}, state, {
				query: action.query
			});
		case C.SET_MENU:
			return Object.assign({}, state, {
				menu: action.menu
			});
		default: return state || initialState().header;
	}
};