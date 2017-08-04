import React from 'react';
import { Link } from 'react-router-dom';
import steemconnect from 'sc2-sdk';
import { FormattedMessage } from 'react-intl';

const Error401 = () =>
  (<div className="main-panel">
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
            id="@statics/need_login"
            defaultMessage="You need to login to use this feature, please"
          />{' '}
          <a href={steemconnect.getLoginURL()}>
            <FormattedMessage id="login" defaultMessage="Login" />
          </a>
          <br />
          <FormattedMessage id="@statics/here_link" defaultMessage="Here's a link to the" />
          <Link to="/">
            <FormattedMessage id="@statics/homepage" defaultMessage="home page" />
          </Link>
          .
        </p>
      </div>
    </div>
  </div>);

export default Error401;
