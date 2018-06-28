import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedRelative } from 'react-intl';
import ListWidget from './ListWidget';
import './PostsWidget.less';

function Post({ created, title, author, url }) {
  return (
    <div>
      <Link to={url}>{title}</Link>
      <div>
        <Link className="PostsWidget__Post__author" to={`/@${author}`}>
          <span className="username">{author}</span>
        </Link>
        <span className="PostsWidget__Post__date">
          <FormattedRelative value={created} />
        </span>
      </div>
    </div>
  );
}

Post.propTypes = {
  created: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

function renderPost(item) {
  return <Post created={item.created} title={item.title} author={item.author} url={item.url} />;
}

export default function PostsWidget({ posts }) {
  return (
    <ListWidget
      icon="icon-headlines"
      title="Recommended posts"
      data={posts}
      renderItem={renderPost}
    />
  );
}

PostsWidget.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      created: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ),
};

PostsWidget.defaultProps = {
  posts: [],
};
