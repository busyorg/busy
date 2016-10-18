import React from 'react';
import CommentItem from './CommentItem';

const CommentsList = ({ comments }) => {
  return (
    <div>
      {
        comments.map((comment, idx) =>
          <CommentItem key={idx} comment={comment} />
        )
      }
    </div>
  );
};

export default CommentsList;
