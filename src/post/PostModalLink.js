import React from 'react';
import PostSingleModal from './postSingle/PostSingleModal';

const handleClick = (e, onClick) => {
  e.preventDefault();
  onClick();
};

const PostModalLink = ({ post, onClick, children }) => {
  const postPath = `/${post.parent_permlink}/@${post.author}/${post.permlink}`;

  return (
    <a href={postPath} onClick={(e) => handleClick(e, onClick)}>
      { children }
    </a>
  );
};

export default PostModalLink;
