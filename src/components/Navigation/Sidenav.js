import React from 'react';
import { Link } from 'react-router';
import './Sidenav.less';

const Sidenav = () =>
  <ul className="Sidenav">
    <li className="Sidenav__item">
      <Link to="#">
        <i className="iconfont icon-mine Sidenav__icon" /> My Profile
      </Link>
    </li>
    <li className="Sidenav__item">
      <Link to="#">
        <i className="iconfont icon-clock Sidenav__icon" /> Timeline
      </Link>
    </li>
    <li className="Sidenav__item Sidenav__item--active">
      <Link to="/trending">
        <i className="iconfont icon-headlines Sidenav__icon" /> News
      </Link>
    </li>
    <li className="Sidenav__item">
      <Link to="/messages">
        <i className="iconfont icon-message Sidenav__icon" /> Messages
      </Link>
    </li>
    <li className="Sidenav__item">
      <Link to="/wallet">
        <i className="iconfont icon-lock Sidenav__icon" /> Wallet
      </Link>
    </li>
  </ul>;

Sidenav.propTypes = {};

export default Sidenav;
