import store from 'store';
import SteemConnect from 'sc2-sdk';
import { createAction } from 'redux-actions';

export const GET_REBLOGGED_LIST = '@reblog/GET_REBLOGGED_LIST';

const getRebloggedListAction = createAction(GET_REBLOGGED_LIST);

const storePostId = (postId) => {
  const reblogged = store.get('reblogged') || [];
  const newReblogged = [...reblogged, postId];
  store.set('reblogged', newReblogged);
  return newReblogged;
};

export const reblog = postId => (dispatch, getState) => {
  const { auth, posts } = getState();
  const post = posts[postId];

  if (!auth.isAuthenticated || !post || auth.user.name === post.author) {
    return null;
  }

  return SteemConnect.reblog(auth.user.name, post.author, post.permlink)
    .then(() => {
      const list = storePostId(postId);
      dispatch(getRebloggedListAction(list));
    })
    .catch((err) => {
      if (err.res && err.res.status === 500) {
        // already reblogged
        const list = storePostId(postId);
        dispatch(getRebloggedListAction(list));
      }
    });
};

export const getRebloggedList = () => (dispatch) => {
  const list = store.get('reblogged') || [];
  dispatch(getRebloggedListAction(list));
};
