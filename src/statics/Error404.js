import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

const Error404 = () =>
  (<div className="main-panel">
    <div className="container my-5">
      <div className="ptl text-center">
        <h1>
          <FormattedMessage id="page_not_found" defaultMessage="Page Not Found" />
        </h1>
        <h2>
          <FormattedMessage
            id="page_not_found_message"
            defaultMessage="Oops! Looks like you followed a bad link."
          />
        </h2>
        <p>
          <FormattedMessage
            id="@statics/is_a_problem_0"
            defaultMessage="If you think this is a problem with Busy, please"
          />{' '}
          <a rel="noopener noreferrer" href="https://busy.org" target="_blank">
            <FormattedMessage id="@statics/is_a_problem_1" defaultMessage="tell us" />
          </a>
          .<br />
          <FormattedMessage id="@statics/here_link" defaultMessage="Here's a link to the" />{' '}
          <Link to="/">
            <FormattedMessage id="@statics/homepage" defaultMessage="home page" />
          </Link>
          .
        </p>
      </div>
    </div>
  </div>);

export default Error404;
