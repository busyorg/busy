var C = require("../constants"),
	initialState = require("../initialstate");

module.exports = function(state,action){
	switch(action.type){
		default: return state || initialState().pages;
	}
};