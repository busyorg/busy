import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import SteemConnect from '../steemConnectAPI';
import './ErrorPage.less';

const Error401 = () => (
  <div className="ErrorPage container">
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
        id="need_login_link_text"
        defaultMessage="You need to login to use this feature, please {link}."
        values={{
          link: (
            <a href={SteemConnect.getLoginURL()}>
              <FormattedMessage id="login" defaultMessage="Login" />
            </a>
          ),
        }}
      />
    </p>
    <p>
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
    </p>
  </div>
);

export default Error401;
