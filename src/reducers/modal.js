var C = require("../constants"),
	initialState = require("../initialstate");

module.exports = function(state,action){
	var newstate = Object.assign({},state); // sloppily copying the old state here, so we never mutate it
	switch(action.type){
		case C.SHOW_MODAL:
			newstate.isVisible = true;
			newstate.page = action.page;
			return newstate;		
		case C.HIDE_MODAL:
			newstate.isVisible = false;
			newstate.page = '';
			return newstate;
		case C.SAVE_REQUEST:
			newstate.isFetching = true;
			return newstate;
		case C.SAVE_SUCCESS:
			newstate.isFetching = false;
			return newstate;
		default: return state || initialState().modal;
	}
};