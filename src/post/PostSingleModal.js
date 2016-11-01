import React from 'react';
import './PostSingleModal.scss';

export default PostSingleModal = ({ content, onClickReblog }) => {
  return (
    <div className="PostSingleModal">
      <h1 className="mvl">{content.title}</h1>
      @{content.author}
    </div>
  );
};
