import React from 'react';
import PostSingleModal from './PostSingleModal';

const handleClick = (e, onClick, post, postPath) => {
  e.preventDefault();
  if (window.history) {
    window.history.pushState({}, post.title, postPath);
  }
  onClick();
};

const PostModalLink = ({ post, onClick, children }) => {
  const postPath = `/${post.parent_permlink}/@${post.author}/${post.permlink}`;

  return (
    <a href={postPath} onClick={(e) => handleClick(e, onClick, post, postPath)}>
      { children }
    </a>
  );
};

export default PostModalLink;
