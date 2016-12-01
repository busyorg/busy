import React from 'react';
import CommentItem from './CommentItem';

const renderComments = (list, comments, likeComment, unlikeComment, auth) => {
  return list.map(({ id , children }) => {
    const comment = comments[id];

    return (
      <CommentItem
        key={id}
        comment={comment}
        likeComment={likeComment}
        unlikeComment={unlikeComment}
        auth={auth}
      >
        { Object.keys(children).length > 0 &&
          renderComments(children, comments, likeComment, unlikeComment, auth)
        }
      </CommentItem>
    );
  })
};

const CommentsList = ({ postId, comments, likeComment, unlikeComment, auth }) => {
  if (!comments.lists[postId]) {
    return null;
  }

  const { show, list } = comments.lists[postId];
  const visibleList = list.slice(0, show);

  return (
    <div className="CommentsList">
      { renderComments(visibleList, comments.comments, likeComment, unlikeComment, auth) }
    </div>
  );
};

export default CommentsList;
