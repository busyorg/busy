var C = require("../constants"),
	initialState = require("../initialstate");

module.exports = function(state, action){
	switch(action.type){
		case C.TAB_CREATE:
			state.push(action.page);
			return state;
		case C.TAB_DELETE:
			if(state.indexOf(action.page) != -1) {
				delete state[state.indexOf(action.page)];
			}
			return state;
		default: return state || initialState().tabs;
	}
};