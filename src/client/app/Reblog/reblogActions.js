import store from 'store';
import { createAction } from 'redux-actions';

export const REBLOG_POST = '@reblog/REBLOG_POST';
export const REBLOG_POST_START = '@reblog/REBLOG_POST_START';
export const REBLOG_POST_SUCCESS = '@reblog/REBLOG_POST_SUCCESS';
export const REBLOG_POST_ERROR = '@reblog/REBLOG_POST_ERROR';

export const GET_REBLOGGED_LIST = '@reblog/GET_REBLOGGED_LIST';
const getRebloggedListAction = createAction(GET_REBLOGGED_LIST);

// We need to use the store, because at this time there is no way to receive user's reblogs via SteemConnect API
const storePostId = (postId, username) => {
  const reblogged = store.get('reblogged') || {};
  const userReblogs = reblogged.username || [];

  const newUserReblogs = [...userReblogs, postId];
  const newReblogged = { ...reblogged, [username]: newUserReblogs };
  store.set('reblogged', newReblogged);
  return newUserReblogs; // only current user's reblogs
};

export const reblog = postId => (dispatch, getState, { steemConnectAPI }) => {
  const { auth, posts } = getState();
  const post = posts.list[postId];
  const { name } = auth.user;

  dispatch({
    type: REBLOG_POST,
    payload: {
      promise: steemConnectAPI.reblog(name, post.author, post.permlink).then(result => {
        const list = storePostId(postId, name);
        dispatch(getRebloggedListAction(list));

        if (window.analytics) {
          window.analytics.track('Reblog', {
            category: 'reblog',
            label: 'submit',
            value: 2,
          });
        }

        return result;
      }),
    },
    meta: { postId },
  });
};

export const getRebloggedList = () => (dispatch, getState) => {
  const { auth: { user: { name } } } = getState();
  const { [name]: userReblogs = [] } = store.get('reblogged') || {};
  dispatch(getRebloggedListAction(userReblogs));
};
