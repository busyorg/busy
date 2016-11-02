import React from 'react';
import './PostSingleModal.scss';

const PostSingleModal = ({ content, onClickReblog }) => {
  return (
    <div className="PostSingleModal">
      <h1 className="mvl">{content.title}</h1>
      @{content.author}
      <p>
        {content.body}
      </p>
    </div>
  );
};

export default PostSingleModal;
