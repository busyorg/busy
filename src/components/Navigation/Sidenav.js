import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import './Sidenav.less';

const Sidenav = ({ username }) => (
  <div>
    {(username) ? <ul className="Sidenav">
      <li>
        <Link to={`/@${username}`}>
          <i className="iconfont icon-mine" /> My Profile
        </Link>
      </li>
      <li>
        <Link to="/">
          <i className="iconfont icon-clock" /> Timeline
        </Link>
      </li>
      <li className="Sidenav__item--active">
        <Link to="/trending">
          <i className="iconfont icon-headlines" /> News
        </Link>
      </li>
      <li>
        <Link to="/messages">
          <i className="iconfont icon-message" /> Messages
        </Link>
      </li>
      <li>
        <Link to="/wallet">
          <i className="iconfont icon-lock" /> Wallet
        </Link>
      </li>
    </ul> : <ul className="Sidenav">
      <li className="Sidenav__item--active">
        <Link to="/trending">
          <i className="iconfont icon-headlines" /> News
        </Link>
      </li>
      <li>
        <Link to="#">
          <i className="iconfont icon-group" /> Communities
        </Link>
      </li>
      <li>
        <Link to="#">
          <i className="iconfont icon-service" /> Shopping
        </Link>
      </li>
    </ul>
    }
  </div>);

Sidenav.propTypes = {
  username: PropTypes.string,
};

Sidenav.defaultProps = {
  username: undefined,
};

export default Sidenav;
