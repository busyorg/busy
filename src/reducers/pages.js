var C = require("../constants"),
	initialState = require("../initialstate"),
	sortBy = require("sort-by");

module.exports = function(state,action){
	var newstate = Object.assign({},state); // sloppily copying the old state here, so we never mutate it
	switch(action.type){
		case C.ENTRY_REQUEST:
			if (!newstate[action.page]) newstate[action.page] = [];
			newstate[action.page].entry = [];
			return newstate;
		case C.ENTRY_SUCCESS:
			if (!newstate[action.page]) newstate[action.page] = [];
			newstate[action.page].entry = action.entry;
			return newstate;
		case C.REPORT_REQUEST:
			if (!newstate[action.page]) newstate[action.page] = [];
			newstate[action.page].current_route = [];
			newstate[action.page].catagories = [];
			newstate[action.page].content = [];
			newstate[action.page].feed_price = [];
			newstate[action.page].isFetching = true;
			newstate[action.page].isLoaded = false;
			return newstate;
		case C.REPORT_SUCCESS:
			if (!newstate[action.page]) newstate[action.page] = [];
			newstate[action.page].current_route = action.current_route;
			newstate[action.page].catagories = action.catagories;
			newstate[action.page].content = action.content;
			newstate[action.page].feed_price = action.feed_price;
			newstate[action.page].isFetching = false;
			newstate[action.page].isLoaded = true;
			return newstate;
		case C.SET_RANGE:
			for(var page in newstate) {
				newstate[action.page].current_route = [];
				newstate[action.page].catagories = [];
				newstate[action.page].content = [];
				newstate[action.page].feed_price = [];
				newstate[page].isFetching = false;
				newstate[page].isLoaded = false;
			}
			return newstate;
		case C.REFRESH:
			for(var page in newstate) {
				newstate[action.page].current_route = [];
				newstate[action.page].catagories = [];
				newstate[action.page].content = [];
				newstate[action.page].feed_price = [];
				newstate[page].isFetching = false;
				newstate[page].isLoaded = false;
			}
			return newstate;
		case C.SET_TITLE:
			if (!newstate[action.page]) newstate[action.page] = [];
			newstate[action.page].title = action.title;
			return newstate;
		case C.SET_ICON:
			if (!newstate[action.page]) newstate[action.page] = [];
			newstate[action.page].icon = action.icon;
			return newstate;
		default: return state || initialState().pages;
	}
};