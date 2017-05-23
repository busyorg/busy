import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const Sidenav = () =>
  <nav className="Sidenav navbar">
    <ul className="navbar-nav">
      <li className="nav-item">
        <Link className="nav-link" to="#">My Profile</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="#">Timeline</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/trending">News</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/messages">Messages</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/wallet">Wallet</Link>
      </li>
    </ul>
  </nav>;

Sidenav.propTypes = {};

export default Sidenav;
