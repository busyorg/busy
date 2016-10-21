import React from 'react';
import { Link } from 'react-router';
import Header from './../app/header';
import MenuAbout from '../app/Menu/MenuAbout';

module.exports = React.createClass({
  render() {
    return (
      <div className="main-panel">
        <Header />
        <MenuAbout />
        <div className="page">
          <div className="block">
            <h1>Help</h1>
            <p><Link to="/trending/busy-help">#busy-help</Link></p>
            <p><Link to="/@busy">@busy</Link></p>
          </div>
        </div>
      </div>
    );
  }
});
