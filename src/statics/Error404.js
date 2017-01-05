import React from 'react';
import { Link } from 'react-router';

import Header from '../app/Header';
import Icon from '../widgets/Icon';

const Error404 = () =>
  <div className="main-panel">
    <Header />
    <div className="container my-3">
      <div className="ptl text-xs-center">
        <h1><Icon name="info" lg /> Page Not Found</h1>
        <h2>Oops! Looks like you followed a bad link.</h2>
        <p>If you think this is a problem with Busy,
          please <a href="https://busy.org" target="_blank">tell us</a>.<br />
          Here's a link to the <Link to="/">home page</Link>.</p>
      </div>
    </div>
  </div>;

export default Error404;
