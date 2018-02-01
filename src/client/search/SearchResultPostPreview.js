import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { FormattedRelative } from 'react-intl';
import Avatar from '../components/Avatar';
import BodyShort from '../components/Story/BodyShort';
import Topic from '../components/Button/Topic';

const SearchResultPostPreview = ({ author, summary, created, permlink, title, tags }) => {
  const postUrl = `/@${author}/${permlink}`;
  return (
    <div className="Search__post">
      <div className="Search__post__header">
        <Link to={`/@${author}`}>
          <Avatar username={author} size={40} />
        </Link>
        <div className="Search__post__header__author">
          <Link to={`/@${author}`}>
            <span className="username">{author}</span>
          </Link>
          <div className="Search__post__created">
            <FormattedRelative value={created} />
          </div>
        </div>
      </div>
      <div className="Search__post__content">
        <Link to={postUrl} className="Search__post__title">
          <h2>{title}</h2>
        </Link>
        <div className="Search__post__summary">
          <Link to={postUrl}>
            <span className="Search__post__summary__body">
              <BodyShort body={summary} />
            </span>
          </Link>
        </div>
        <div className="Search__post__tags">
          {_.map(_.uniq(tags), tag => (
            <span key={tag} className="Search__post__tags__container">
              <Topic name={tag} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

SearchResultPostPreview.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
  author: PropTypes.string,
  summary: PropTypes.string,
  created: PropTypes.string,
  permlink: PropTypes.string,
};

SearchResultPostPreview.defaultProps = {
  tags: [],
  title: '',
  author: '',
  summary: '',
  created: '',
  permlink: '',
};

export default SearchResultPostPreview;
