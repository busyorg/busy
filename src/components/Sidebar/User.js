import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from '../Avatar';
import FollowButton from '../../widgets/FollowButton';
import './User.less';

const User = ({ user }) =>
  (<div key={user.name} className="User">
    <div className="User__top">
      <div className="User__links">
        <Link to={`/@${user.name}`}>
          <Avatar username={user.name} size={34} />
        </Link>
        <Link to={`/@${user.name}`}>
          <span className="User__name">
            {user.name}
          </span>
        </Link>
      </div>
      <FollowButton username={user.name} />
    </div>
    <div className="User__about">
      {user.about}
    </div>
    <div className="User__divider" />
  </div>);

User.propTypes = {
  user: PropTypes.shape().isRequired,
};

export default User;
