import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import './ErrorPage.less';

const Error404 = () => (
  <div className="ErrorPage container">
    <h1>
      <FormattedMessage id="page_not_found" defaultMessage="Page Not Found" />
    </h1>
    <h2>
      <FormattedMessage
        id="page_not_found_message"
        defaultMessage="Oops! Looks like you followed a bad link."
      />
    </h2>
    <FormattedMessage
      id="homepage_link_text"
      defaultMessage="Here's a link to {link}."
      values={{
        link: (
          <Link to="/">
            <FormattedMessage id="homepage" defaultMessage="the home page" />
          </Link>
        ),
      }}
    />
  </div>
);

export default Error404;
