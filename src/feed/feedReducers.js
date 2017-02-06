import * as feedTypes from './feedActions';
import * as userTypes from '../user/userActions';
import * as bookmarksActions from '../bookmarks/bookmarksActions';


const initialState = {
  feed: {},
  hot: {},
  cashout: {},
  created: {},
  active: {},
  trending: {},
  comments: {},
  blog: {},
  bookmarks: {},
  replies: {},
};

const feedFetching = (state = false, action) => {
  switch (action.type) {
    case feedTypes.GET_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_MORE_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_USER_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_MORE_USER_FEED_CONTENT_SUCCESS:
    case bookmarksActions.GET_BOOKMARKS_SUCCESS:
      return false;
    case feedTypes.GET_FEED_CONTENT:
    case feedTypes.GET_MORE_FEED_CONTENT:
    case feedTypes.GET_USER_FEED_CONTENT:
    case feedTypes.GET_MORE_USER_FEED_CONTENT:
    case bookmarksActions.GET_BOOKMARKS_START:
      return true;
    default:
      return state;
  }
};

const feedIdsList = (state = [], action) => {
  switch (action.type) {
    case feedTypes.GET_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_USER_FEED_CONTENT_SUCCESS:
    case bookmarksActions.GET_BOOKMARKS_SUCCESS:
      const postsIds = action.payload.postsData.map(post => post.id);
      return [
        ...postsIds,
      ];
    case feedTypes.GET_MORE_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_MORE_USER_FEED_CONTENT_SUCCESS:
      // first element of the array is the same element loaded in the previous chunk
      const morePostsIds = action.payload.postsData.map(post => post.id).slice(1);
      // add data only if it doesn't exist
      if (state[state.length - 1] !== morePostsIds[morePostsIds.length - 1]) {
        return [
          ...state,
          ...morePostsIds,
        ];
      }
    case userTypes.GET_USER_COMMENTS_SUCCESS:
      return Object.keys(action.payload.content).map(key => action.payload.content[key].id);
    case userTypes.GET_MORE_USER_COMMENTS_SUCCESS:
      return action.payload.result.map(comment => comment.id);
    default:
      return state;
  }
};

const feedSortBySubItem = (state = {}, action) => {
  switch (action.type) {
    case feedTypes.GET_FEED_CONTENT:
    case feedTypes.GET_MORE_FEED_CONTENT:
    case feedTypes.GET_MORE_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_USER_FEED_CONTENT:
    case feedTypes.GET_MORE_USER_FEED_CONTENT:
    case feedTypes.GET_MORE_USER_FEED_CONTENT_SUCCESS:
    case userTypes.GET_USER_COMMENTS_START:
    case userTypes.GET_MORE_USER_COMMENTS_START:
    case bookmarksActions.GET_BOOKMARKS_START:
    case bookmarksActions.GET_BOOKMARKS_SUCCESS:
      return {
        ...state,
        isFetching: feedFetching(undefined, action),
        list: feedIdsList(state.list, action),
      };
    case feedTypes.GET_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_USER_FEED_CONTENT_SUCCESS:
    case userTypes.GET_USER_COMMENTS_SUCCESS:
    case userTypes.GET_MORE_USER_COMMENTS_SUCCESS:
      return {
        ...state,
        hasMore: true,
        isLoaded: true,
        isFetching: feedFetching(undefined, action),
        list: feedIdsList(state.list, action),
      };
    case feedTypes.FEED_HAS_NO_MORE:
      return {
        ...state,
        hasMore: false,
      };
    default:
      return state;
  }
};

const feedSortByItem = (state = {}, action) => {
  switch (action.type) {
    case feedTypes.GET_FEED_CONTENT:
    case feedTypes.GET_MORE_FEED_CONTENT:
    case feedTypes.GET_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_MORE_FEED_CONTENT_SUCCESS:
    case feedTypes.FEED_HAS_NO_MORE:
      return {
        ...state,
        [action.payload.category]: feedSortBySubItem(state[action.payload.category], action)
      };
    case feedTypes.GET_USER_FEED_CONTENT:
    case feedTypes.GET_USER_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_MORE_USER_FEED_CONTENT:
    case feedTypes.GET_MORE_USER_FEED_CONTENT_SUCCESS:
      return {
        ...state,
        [action.payload.username]: feedSortBySubItem(state[action.payload.username], action)
      };
    case userTypes.GET_USER_COMMENTS_START:
    case userTypes.GET_USER_COMMENTS_SUCCESS:
    case userTypes.GET_MORE_USER_COMMENTS_START:
    case userTypes.GET_MORE_USER_COMMENTS_SUCCESS:
      return {
        ...state,
        [action.meta.username]: feedSortBySubItem(state[action.meta.username], action)
      };
    case bookmarksActions.GET_BOOKMARKS_START:
    case bookmarksActions.GET_BOOKMARKS_SUCCESS:
      return {
        ...state,
        all: feedSortBySubItem(state.all, action),
      };
    default:
      return state;
  }
};

const feed = (state = initialState, action) => {
  switch (action.type) {
    case feedTypes.GET_FEED_CONTENT:
    case feedTypes.GET_MORE_FEED_CONTENT:
    case feedTypes.GET_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_MORE_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_USER_FEED_CONTENT:
    case feedTypes.GET_USER_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_MORE_USER_FEED_CONTENT:
    case feedTypes.GET_MORE_USER_FEED_CONTENT_SUCCESS:
    case feedTypes.FEED_HAS_NO_MORE:
      return {
        ...state,
        [action.payload.sortBy]: feedSortByItem(state[action.payload.sortBy], action)
      };
    case userTypes.GET_USER_COMMENTS_START:
    case userTypes.GET_USER_COMMENTS_SUCCESS:
    case userTypes.GET_MORE_USER_COMMENTS_START:
    case userTypes.GET_MORE_USER_COMMENTS_SUCCESS:
      return {
        ...state,
        comments: feedSortByItem(state.comments, action)
      };
    case bookmarksActions.GET_BOOKMARKS_START:
    case bookmarksActions.GET_BOOKMARKS_SUCCESS:
      return {
        ...state,
        bookmarks: feedSortByItem(state.bookmarks, action)
      };
    case bookmarksActions.TOGGLE_BOOKMARK:
      const toggledId = action.payload;
      // remove from feed if toggled off
      if (state.bookmarks.all && state.bookmarks.all.list.includes(toggledId)) {
        return {
          ...state,
          bookmarks: {
            ...state.bookmarks,
            all: {
              ...state.bookmarks.all,
              list: state.bookmarks.all.list.filter(item => item !== toggledId),
            },
          },
        };
      }
    default:
      return state;
  }
};

export default feed;
