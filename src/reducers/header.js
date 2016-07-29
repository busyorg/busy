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
		case C.TAB_CREATE:
			state.tabs.push(action.page);
			return state;
		case C.TAB_DELETE:
			if(state.tabs.indexOf(action.page) != -1) {
				delete state.tabs[state.indexOf(action.page)];
			}
			return state;
		default: return state || initialState().header;
	}
};