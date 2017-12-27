import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from '../components/Avatar';

const SearchResultUserPreview = ({ username }) => (
  <div className="Search__user">
    <Link to={`/@${username}`}>
      <Avatar username={username} size={40} />
    </Link>
    <Link to={`/@${username}`}>
      <span className="Search__user__name username">{username}</span>
    </Link>
  </div>
);

SearchResultUserPreview.propTypes = {
  username: PropTypes.string,
};

SearchResultUserPreview.defaultProps = {
  username: '',
};

export default SearchResultUserPreview;
