import _ from 'lodash';

function getCommentAnchor(comment) {
  const { url } = comment;

  if (typeof url !== 'string') return null;

  return _.get(url.split('#'), '[1]', null);
}

/**
 * Finds the currently linked comment in the url after the anchor #
 * @param comments a array|object of comment objects
 * @returns the comment linked or null if not found
 */
export function getLinkedComment(comments = []) {
  if (typeof window === 'undefined') {
    return null;
  }

  const anchor = window.location.hash.replace('#', '');
  if (Array.isArray(comments)) {
    for (let i = 0; i < comments.length; i += 1) {
      if (getCommentAnchor(comments[i]) === anchor) {
        return comments[i];
      }
    }
  } else {
    const commentsKeys = Object.keys(comments);
    for (let i = 0; i < commentsKeys.length; i += 1) {
      const comment = comments[commentsKeys[i]];
      if (getCommentAnchor(comment) === anchor) {
        return comment;
      }
    }
  }
  return null;
}

/**
 * Finds the top comment based on its child and root post.
 * @param root Parent post to all comments
 * @param comments An object of id:comment objects
 * @param child The comment to start the traversal from
 * @returns {*}
 */
export function findTopComment(root, comments, child) {
  if (!child || !root) {
    return null;
  }

  let top = child;
  const commentIds = Object.keys(comments);
  while (top && top.parent_permlink !== root.permlink && top.parent_author !== root.author) {
    for (let i = 0; i < commentIds.length; i += 1) {
      if (comments[commentIds[i]].permlink === top.parent_permlink) {
        top = comments[commentIds[i]];
        break;
      }
    }
  }

  return top;
}

export default null;
