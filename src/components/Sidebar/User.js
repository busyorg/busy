import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../Avatar';
import Follow from '../Button/Follow';
import './User.less';

const User = ({ user }) =>
  <div key={user.name}>
    <div className="User__top">
      <div className="User__links">
        <Link to={`/${user.name}`}>
          <Avatar username={user.name} size={34} />
        </Link>
        <Link to={`/${user.name}`}>
          <b className="User__name">{user.name}</b>
        </Link>
      </div>
      <Follow username={user.name} />
    </div>
    <div className="User__about">{user.about}</div>
    <div className="User__divider" />
  </div>;

User.propTypes = {
  user: PropTypes.shape(),
};

export default User;
