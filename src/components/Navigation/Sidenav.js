import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';

const Sidenav = () =>
  <nav className="Sidenav navbar">
    <ul className="navbar-nav">
      <li className="nav-item">
        <Link className="nav-link" to="#">
          <span className="icon-smile" /> My Profile
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="#">
          <span className="icon-timer" /> Timeline
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/trending">
          <span className="icon-calendar" /> News
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/messages">
          <span className="icon-chat" /> Messages
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/wallet">
          <span className="icon-touch_id" /> Wallet
        </Link>
      </li>
    </ul>
  </nav>;

Sidenav.propTypes = {};

export default Sidenav;
