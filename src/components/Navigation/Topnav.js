import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../Avatar';
import './Topnav.less';

const Topnav = ({ username }) =>
  <nav className="Topnav navbar navbar-toggleable-md navbar-light bg-white">
    <div className="container">
      <Link className="navbar-brand text-primary" to="/">busy</Link>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <div className="navbar-nav mr-auto" />
        {username
          ? <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link text-primary" to={`/@${username}`}>
                <Avatar username={username} sm />
                <span className="ml-2">{username}</span>
              </Link>
            </li>
            <li className="nav-item align-self-center">
              <Link className="nav-link" to="#">
                <span className="icon-beanie" />
              </Link>
            </li>
            <li className="nav-item align-self-center">
              <Link className="nav-link" to="#">Settings</Link>
            </li>
          </ul>
          : <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/signup">Sign Up</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">Log In</Link>
            </li>
          </ul>
        }
      </div>
    </div>
  </nav>;

Topnav.propTypes = {
  username: PropTypes.string,
};

export default Topnav;
