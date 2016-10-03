import React from 'react';

const CommentsList = ({ commentsData, limit }) => {
  return (
    commentsData.map((comment, idx) => {
      return (
        <div key={idx}>{ comment.author }:{ comment.body }</div>
      );
    })
  );
};

export default CommentsList;
