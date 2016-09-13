import * as appTypes from './appActionTypes';

const initialState = {
  isFetching: false,
  isLoaded: false,
  errorMessage: '',
  sidebarIsVisible: false
};

// TODO(p0o): some actionsTypes in this reducer are not defined anywhere, need to figure it out later

export default (state = initialState, action) =>{
	switch(action.type){
		case appTypes.FEED_REQUEST:
			return Object.assign({}, state, {
				isFetching: true,
				isLoaded: false
			});
		case appTypes.FEED_SUCCESS:
			return Object.assign({}, state, {
				isFetching: false,
				isLoaded: true
			});
		case appTypes.FEED_FAILURE:
			return Object.assign({}, state, {
				isFetching: false,
				isLoaded: true
			});
		case appTypes.CONTENT_REQUEST:
			return Object.assign({}, state, {
				isFetching: true,
				isLoaded: false
			});
		case appTypes.CONTENT_SUCCESS:
			return Object.assign({}, state, {
				isFetching: false,
				isLoaded: true
			});
		case appTypes.ACCOUNT_REQUEST:
			return Object.assign({}, state, {
				isFetching: true,
				isLoaded: false
			});
		case appTypes.ACCOUNT_SUCCESS:
			return Object.assign({}, state, {
				isFetching: false,
				isLoaded: true
			});
		case appTypes.CONFIG_SUCCESS:
			return Object.assign({}, state, {
				config: action.config
			});
		case appTypes.SHOW_SIDEBAR:
			return Object.assign({}, state, {
				sidebarIsVisible: true
			});
		case appTypes.HIDE_SIDEBAR:
			return Object.assign({}, state, {
				sidebarIsVisible: false
			});
		default:
      return state;
	}
};

const headerInitialState = {
  menu: 'primary',
  tabs: [],
  query: ''
};

export const headerReducer = (state = headerInitialState, action) => {
  switch(action.type){
    case appTypes.SET_MENU:
      return Object.assign({}, state, {
        menu: action.menu
      });
    default:
      return state;
  }
};
