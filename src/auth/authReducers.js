var C = require("../constants"),
	initialState = require("../initialstate");

module.exports = function(state,action){
	switch(action.type){
		case C.LOGIN_REQUEST:
			return Object.assign({}, state, {
				isFetching: true,
				isAuthenticated: false,
				user: []
			});
		case C.LOGIN_SUCCESS:
			return Object.assign({}, state, {
				isFetching: false,
				isAuthenticated: true,
				errorMessage: '',
				user: action.user
			});
		case C.LOGIN_FAILURE:
			return Object.assign({}, state, {
				isFetching: false,
				isAuthenticated: false,
				errorMessage: action.message
			});
		case C.LOGOUT_SUCCESS:
			return Object.assign({}, state, {
				isFetching: true,
				isAuthenticated: false
			});
		default: return state || initialState().auth;
	}
};