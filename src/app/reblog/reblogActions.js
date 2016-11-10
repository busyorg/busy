import store from 'store';
import SteemConnect from 'steemconnect';
import Promise from 'bluebird';
import { createAction } from 'redux-actions';

SteemConnect.reblog = Promise.promisify(SteemConnect.reblog, { context: SteemConnect });

export const GET_REBLOGGED_LIST = '@reblog/GET_REBLOGGED_LIST';

const getRebloggedListAction = createAction(GET_REBLOGGED_LIST);

const storePostId = (postId) => {
  const reblogged = store.get('reblogged') || [];
  const newReblogged = [ ...reblogged, postId ];
  store.set('reblogged', newReblogged);
  return newReblogged;
};

export const reblog = (postId) => {
  return (dispatch, getState) => {
    const { auth, posts } = getState();
    const post = posts[postId];

    if (!auth.isAuthenticated || !post || auth.user.name === post.author) {
      return;
    }

    SteemConnect.reblog(auth.user.name, post.author, post.permlink).then(() => {
      const list = storePostId(postId);
      dispatch(getRebloggedListAction(list));
    }).catch(err => {
      if(err.res && err.res.status === 500) {
        // already reblogged
        const list = storePostId(postId);
        dispatch(getRebloggedListAction(list));
      }
    });
  }
};

export const getRebloggedList = () => {
  return (dispatch) => {
    const list = store.get('reblogged') || [];
    dispatch(getRebloggedListAction(list));
  }
};
