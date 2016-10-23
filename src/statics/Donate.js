import React from 'react';
import { Link } from 'react-router';
import Header from '../app/Header';
import MenuAbout from '../app/Menu/MenuAbout';

module.exports = React.createClass({
  render() {
    return (
      <div className="main-panel">
        <Header />
        <MenuAbout />
        <div className="page">
          <div className="block">
            <h1>Donate</h1>
            <p><Link to="/@busy">@busy</Link></p>
            <br /><br />
            <h1>Donors</h1>
            <p><Link to="/@steemit">@steemit</Link></p>
            <p><Link to="/@smooth">@smooth</Link></p>
            <p><Link to="/@cass">@cass</Link></p>
            <p><Link to="/@bhuz">@bhuz</Link></p>
          </div>
        </div>
      </div>
    );
  }
});
