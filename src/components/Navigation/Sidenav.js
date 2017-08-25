import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import './Sidenav.less';

const Sidenav = ({ username }) =>
  (<div>
    {username &&
      <ul className="Sidenav">
        <li>
          <NavLink to={`/@${username}`} activeClassName="Sidenav__item--active">
            <i className="iconfont icon-mine" />
            <FormattedMessage id="my_profile" defaultMessage="My profile" />
          </NavLink>
        </li>
        <li>
          <NavLink to="/" activeClassName="Sidenav__item--active" exact>
            <i className="iconfont icon-clock" />
            <FormattedMessage id="feed" defaultMessage="Feed" />
          </NavLink>
        </li>
        <li>
          <NavLink to="/trending" activeClassName="Sidenav__item--active">
            <i className="iconfont icon-headlines" />
            <FormattedMessage id="news" defaultMessage="News" />
          </NavLink>
        </li>
        <li>
          <NavLink to={`/@${username}/transfers`} activeClassName="Sidenav__item--active">
            <i className="iconfont icon-wallet" />
            <FormattedMessage id="wallet" defaultMessage="Wallet" />
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
