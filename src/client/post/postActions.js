import { createAsyncActionType } from '../helpers/stateHelpers';

export const GET_CONTENT = createAsyncActionType('@post/GET_CONTENT');

export const LIKE_POST = '@post/LIKE_POST';
export const LIKE_POST_START = '@post/LIKE_POST_START';
export const LIKE_POST_SUCCESS = '@post/LIKE_POST_SUCCESS';
export const LIKE_POST_ERROR = '@post/LIKE_POST_ERROR';

export const getContent = (author, permlink, afterLike) => (dispatch, getState, { blockchainAPI }) => {
  if (!author || !permlink) {
    return null;
  }

  return dispatch({
    type: GET_CONTENT.ACTION,
    payload: {
      promise: blockchainAPI.sendAsync('get_content', [author, permlink]).then(res => {
        if (res.id === 0) {
					console.error('err', `There is no such post @${author}/${permlink}`)
					console.error('err', res)
					// throw new Error('There is no such post')
				};
        return res;
			}).catch(err=>{
				console.error('err', err)
			})
    },
    meta: {
      author,
      permlink,
      afterLike,
    },
  }).catch(() => {});
};

export const votePost = (postId, author, permlink, weight = 10000) => (
  dispatch,
  getState,
  { weauthjsInstance },
) => {
  const { auth, posts } = getState();
  if (!auth.isAuthenticated) {
    return null;
  }

  const post = posts.list[postId];
  const voter = auth.user.name;

  return dispatch({
    type: LIKE_POST,
    payload: {
      promise: weauthjsInstance.vote(voter, post.author, post.permlink, weight).then(res => {
        if (window.analytics) {
          window.analytics.track('Vote', {
            category: 'vote',
            label: 'submit',
            value: 1,
          });
        }

        // Delay to make sure you get the latest data (unknown issue with API)
        setTimeout(() => dispatch(getContent(post.author, post.permlink, true)), 1000);
        return res;
      }),
    },
    meta: { postId, voter, weight },
  });
};
