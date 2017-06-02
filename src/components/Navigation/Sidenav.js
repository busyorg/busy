import React from 'react';
import { Link } from 'react-router';
import './Sidenav.less';

const Sidenav = () =>
  <ul className="Sidenav">
    <li className="Sidenav__item">
      <Link to="#">
        <span className="icon-smile" /> My Profile
      </Link>
    </li>
    <li className="Sidenav__item">
      <Link to="#">
        <span className="icon-timer" /> Timeline
      </Link>
    </li>
    <li className="Sidenav__item Sidenav__item--active">
      <Link to="/trending">
        <span className="icon-calendar" /> News
      </Link>
    </li>
    <li className="Sidenav__item">
      <Link to="/messages">
        <span className="icon-chat" /> Messages
      </Link>
    </li>
    <li className="Sidenav__item">
      <Link to="/wallet">
        <span className="icon-touch_id" /> Wallet
      </Link>
    </li>
  </ul>;

Sidenav.propTypes = {};

export default Sidenav;
