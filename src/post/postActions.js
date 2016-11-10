export const GET_CONTENT = 'GET_CONTENT';
export const GET_CONTENT_START = 'GET_CONTENT_START';
export const GET_CONTENT_SUCCESS = 'GET_CONTENT_SUCCESS';
export const GET_CONTENT_ERROR = 'GET_CONTENT_ERROR';


export const getContent = (postAuthor, postPermlink) => {
  return (dispatch, getState, { steemAPI }) => {
    if (!postAuthor || !postPermlink) {
      return;
    }

    dispatch({
      type: GET_CONTENT,
      payload: {
        promise: steemAPI.getContentAsync(postAuthor, postPermlink),
      },
    });

  };
};
