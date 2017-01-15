import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import Header from '../app/Header';
import Icon from '../widgets/Icon';

const Error404 = () =>
  <div className="main-panel">
    <Header />
    <div className="container my-5">
      <div className="ptl text-center">
        <h1><FormattedMessage id="page_not_found" /></h1>
        <h2><FormattedMessage id="page_not_found_message" /></h2>
        <p>If you think this is a problem with Busy, please
          { ' ' }
          <a
            rel="noopener noreferrer"
            href="https://busy.org"
            target="_blank"
          >
            tell us
          </a>
          .<br />
          Here's a link to the <Link to="/">home page</Link>.</p>
      </div>
    </div>
  </div>;

export default Error404;
