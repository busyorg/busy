import store from 'store';
import SteemConnect from 'sc2-sdk';
import { createAction } from 'redux-actions';
import { notify } from '../Notification/notificationActions';
import parseBlockchainError from '../../helpers/errors';

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

  if (!auth.isAuthenticated) {
    dispatch(notify('You are not logged in', 'error'));
    return null;
  }

  if (!post) {
    dispatch(notify("Couldn't find this post", 'error'));
    return null;
  }

  if (auth.user.name === post.author) {
    dispatch(notify("You can't reblog your own post", 'error'));
    return null;
  }

  return SteemConnect.reblog(auth.user.name, post.author, post.permlink)
    .then((result) => {
      if (result.errors) {
        dispatch(notify(parseBlockchainError(result.errors), 'error'));
        return result;
      }
      const list = storePostId(postId);
      dispatch(getRebloggedListAction(list));
      return result;
    });
};

export const getRebloggedList = () => (dispatch) => {
  const list = store.get('reblogged') || [];
  dispatch(getRebloggedListAction(list));
};
