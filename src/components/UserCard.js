import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import Follow from '../components/Button/Follow';
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
    <Follow />
  </div>);

UserCard.propTypes = {
  username: PropTypes.string.isRequired,
};

export default UserCard;
