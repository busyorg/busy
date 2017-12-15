import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import SteemConnect from '../steemConnectAPI';

const Error401 = () => (
  <div className="main-panel">
    <div className="container my-5">
      <div className="ptl text-center">
        <h1>
          <FormattedMessage id="page_forbidden" defaultMessage="Page Requires Authentication" />
        </h1>
        <h2>
          <FormattedMessage
            id="page_forbidden_message"
            defaultMessage="Oops! Looks like you need to login to use this page."
          />
        </h2>
        <p>
          <FormattedMessage
            id="need_login"
            defaultMessage="You need to login to use this feature, please"
          />{' '}
          <a href={SteemConnect.getLoginURL()}>
            <FormattedMessage id="login" defaultMessage="Login" />
          </a>
          <br />
          <FormattedMessage id="here_link" defaultMessage="Here's a link to the" />
          <Link to="/">
            <FormattedMessage id="homepage" defaultMessage="home page" />
          </Link>
          .
        </p>
      </div>
    </div>
  </div>
);

export default Error401;
