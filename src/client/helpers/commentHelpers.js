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
 * Finds the root comment from a give child comment.
 * Root refers to level 1 comments not the post related to the comments.
 * @param comments An object of id:comment objects
 * @param child The comment to start the traversal from
 * @returns {*}
 */
export function findRootComment(comments, child) {
  if (!child) {
    return null;
  }
  let root = child;
  const commentIDS = Object.keys(comments);
  while (root && root.depth > 1) {
    for (let i = 0; i < commentIDS.length; i += 1) {
      if (comments[commentIDS[i]].permlink === root.parent_permlink) {
        root = comments[commentIDS[i]];
        break;
      }
    }
  }
  return root;
}

export default null;
