import store from 'store';
import { createAction } from 'redux-actions';

export const REBLOG_POST = '@reblog/REBLOG_POST';
export const REBLOG_POST_START = '@reblog/REBLOG_POST_START';
export const REBLOG_POST_SUCCESS = '@reblog/REBLOG_POST_SUCCESS';
export const REBLOG_POST_ERROR = '@reblog/REBLOG_POST_ERROR';

export const GET_REBLOGGED_LIST = '@reblog/GET_REBLOGGED_LIST';
const getRebloggedListAction = createAction(GET_REBLOGGED_LIST);

const storePostId = postId => {
  const reblogged = store.get('reblogged') || [];
  const newReblogged = [...reblogged, postId];
  store.set('reblogged', newReblogged);
  return newReblogged;
};

export const reblog = postId => (dispatch, getState, { steemConnectAPI }) => {
  const { auth, posts } = getState();
  const post = posts.list[postId];

  dispatch({
    type: REBLOG_POST,
    payload: {
      promise: steemConnectAPI.reblog(auth.user.name, post.author, post.permlink).then(result => {
        const list = storePostId(postId);
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

export const getRebloggedList = () => dispatch => {
  const list = store.get('reblogged') || [];
  dispatch(getRebloggedListAction(list));
};
