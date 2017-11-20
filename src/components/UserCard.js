import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FollowButton from '../widgets/FollowButton';
import Avatar from '../components/Avatar';
import './UserCard.less';

const UserCard = ({ username, alt }) => (
  <div className="UserCard">
    <div className="UserCard__left">
      <Link to={`/@${username}`}>
        <Avatar username={username} size={40} />
      </Link>
      <Link to={`/@${username}`}>{username}</Link>
      {alt && <span className="UserCard__alt">{alt}</span>}
    </div>
    <FollowButton username={username} />
  </div>
);

UserCard.propTypes = {
  username: PropTypes.string.isRequired,
  alt: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
};

UserCard.defaultProps = {
  alt: '',
};

export default UserCard;
