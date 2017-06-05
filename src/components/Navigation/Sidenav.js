import React from 'react';
import { Link } from 'react-router';
import './Sidenav.less';

const Sidenav = () =>
  <ul className="Sidenav">
    <li>
      <Link to="#">
        <i className="iconfont icon-mine" /> My Profile
      </Link>
    </li>
    <li>
      <Link to="#">
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
  </ul>;

Sidenav.propTypes = {};

export default Sidenav;
