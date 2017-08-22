import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FollowButton from '../widgets/FollowButton';
import Avatar from '../components/Avatar';
import './UserCard.less';

const UserCard = ({ username }) =>
  (<div className="UserCard">
    <div className="UserCard__left">
      <Link to={`/@${username}`}>
        <Avatar username={username} size={40} />
      </Link>
      <Link to={`/@${username}`}>
        {username}
      </Link>
    </div>
    <FollowButton username={username} />
  </div>);

UserCard.propTypes = {
  username: PropTypes.string.isRequired,
};

export default UserCard;
