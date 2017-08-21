import store from 'store';
import SteemConnect from 'sc2-sdk';
import ReactGA from 'react-ga';
import { createAction } from 'redux-actions';
import { notify } from '../Notification/notificationActions';
import parseBlockchainError from '../../helpers/errors';

export const GET_REBLOGGED_LIST = '@reblog/GET_REBLOGGED_LIST';
const getRebloggedListAction = createAction(GET_REBLOGGED_LIST);

export const START_REBLOGGING = '@reblog/START_REBLOGGING';
export const startReblogging = createAction(START_REBLOGGING);

export const FINISH_REBLOGGING = '@reblog/FINISH_REBLOGGING';
export const finishReblogging = createAction(FINISH_REBLOGGING);

const storePostId = (postId) => {
  const reblogged = store.get('reblogged') || [];
  const newReblogged = [...reblogged, postId];
  store.set('reblogged', newReblogged);
  return newReblogged;
};

export const reblog = postId => (dispatch, getState) => {
  dispatch(startReblogging(postId));
  const { auth, posts } = getState();
  const post = posts[postId];

  // if (!auth.isAuthenticated) {
  //  dispatch(notify('You are not logged in', 'error'));
  //  dispatch(finishReblogging(postId));
  //  return null;
  // }
  //
  // if (!post) {
  //  dispatch(notify("Couldn't find this post", 'error'));
  //  dispatch(finishReblogging(postId));
  //  return null;
  // }
  //
  // if (auth.user.name === post.author) {
  //  dispatch(notify("You can't reblog your own post", 'error'));
  //  dispatch(finishReblogging(postId));
  //  return null;
  // }

  // TODO: Use redux-promise-middleware for handling reblogs.

  return SteemConnect.reblog(auth.user.name, post.author, post.permlink)
    .then((result) => {
      if (result.errors) {
        dispatch(notify(parseBlockchainError(result.errors), 'error'));
        dispatch(finishReblogging(postId));
        return result;
      }
      const list = storePostId(postId);
      dispatch(getRebloggedListAction(list));
      dispatch(finishReblogging(postId));

      ReactGA.event({
        category: 'reblog',
        action: 'submit',
        value: 2,
      });

      return result;
    });
};

export const getRebloggedList = () => (dispatch) => {
  const list = store.get('reblogged') || [];
  dispatch(getRebloggedListAction(list));
};
