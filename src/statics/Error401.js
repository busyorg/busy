import React from 'react';
import { Link } from 'react-router';
import steemconnect from 'steemconnect';
import { FormattedMessage } from 'react-intl';
import Header from '../app/Header';
import Icon from '../widgets/Icon';

const Error401 = () =>
  <div className="main-panel">
    <Header />
    <div className="container my-5">
      <div className="ptl text-center">
        <h1><FormattedMessage id="page_forbidden" /></h1>
        <h2><FormattedMessage id="page_forbidden_message" /></h2>
        <p>You need to login to use the Chat feature, please
          { ' ' }
          <a href={steemconnect.getLoginURL()}>
            <Icon name="lock_outline" />
            {' '}<FormattedMessage id="login" />
          </a>
          <br />
          Here's a link to the <Link to="/">home page</Link>.</p>
      </div>
    </div>
  </div>;

export default Error401;
