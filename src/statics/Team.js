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
            <h1>Team</h1>
            <p><Link to="/@ekitcho">@ekitcho</Link> CEO</p>
            <p><Link to="/@fabien">@fabien</Link> CTO</p>
            <p><Link to="/@clains">@clains</Link> Ambassador</p>
            <p><Link to="/@nil1511">@nil1511</Link> Developer</p>
            <p><Link to="/@p0o">@p0o</Link> Developer</p>
            <p><Link to="/@yamadapc">@yamadapc</Link> Developer</p>
            <p><Link to="/@faddat">@faddat</Link> Server Architecture</p>
            <p><Link to="/@spectral">@spectral</Link> Advisor</p>
            <p><Link to="/@picokernel">@picokernel</Link> Developer Advisor</p>
            <p><Link to="/@svk">@svk</Link> Developer Advisor</p>
            <p><Link to="/@cass">@cass</Link> Advisor</p>
            <p><Link to="/@smooth">@smooth</Link> Advisor</p>
            <p>You? <Link to="/@fabien">Contact us</Link></p>
          </div>
        </div>
      </div>
    );
  }
});
