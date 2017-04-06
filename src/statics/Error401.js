import React from 'react';
import { Link } from 'react-router';
import steemconnect from 'steemconnect';
import { FormattedMessage } from 'react-intl';
import Icon from '../widgets/Icon';

const Error401 = () =>
  <div className="main-panel">
    <div className="container my-5">
      <div className="ptl text-center">
        <h1><FormattedMessage id="page_forbidden" /></h1>
        <h2><FormattedMessage id="page_forbidden_message" /></h2>
        <p>
          <FormattedMessage
            id="@statics/need_login"
            defaultMessage="You need to login to use this feature, please"
          />
          {' '}
          <a href={steemconnect.getLoginURL()}>
            <Icon name="lock_outline" />
            {' '}<FormattedMessage id="login" />
          </a>
          <br />
          <FormattedMessage
            id="@statics/here_link"
            defaultMessage="Here's a link to the"
          />
          <Link to="/">
            <FormattedMessage
              id="@statics/homepage"
              defaultMessage="home page"
            />
          </Link>
          .
        </p>
      </div>
    </div>
  </div>;

export default Error401;
