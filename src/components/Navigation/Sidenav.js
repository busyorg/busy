import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import './Sidenav.less';

const Sidenav = ({ username }) =>
  (<div>
    {username &&
      <ul className="Sidenav">
        <li>
          <NavLink to={`/@${username}`} activeClassName="Sidenav__item--active">
            <i className="iconfont icon-mine" /> My Profile
          </NavLink>
        </li>
        <li>
          <NavLink to="/" activeClassName="Sidenav__item--active" exact>
            <i className="iconfont icon-clock" /> Feed
          </NavLink>
        </li>
        <li>
          <NavLink to="/trending" activeClassName="Sidenav__item--active">
            <i className="iconfont icon-headlines" /> News
          </NavLink>
        </li>
        <li>
          <NavLink to={`/@${username}/transfers`} activeClassName="Sidenav__item--active">
            <i className="iconfont icon-wallet" /> Wallet
          </NavLink>
        </li>
      </ul>}
  </div>);

Sidenav.propTypes = {
  username: PropTypes.string,
};

Sidenav.defaultProps = {
  username: undefined,
};

export default Sidenav;
