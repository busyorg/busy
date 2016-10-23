import React from 'react';
import CommentItem from './CommentItem';

const renderComments = (list, comments) => {
  return list.map(({ id , children }) => {
    const comment = comments[id];

    return (
      <CommentItem key={id} comment={comment} >
        { Object.keys(children).length > 0 &&
          renderComments(children, comments)
        }
      </CommentItem>
    );
  })
};

const CommentsList = ({ postId, comments }) => {
  if (!comments.lists[postId]) {
    return null;
  }

  const { show, list } = comments.lists[postId];
  const visibleList = list.slice(0, show);

  return (
    <div>
      { renderComments(visibleList, comments.comments) }
    </div>
  );
};

export default CommentsList;
