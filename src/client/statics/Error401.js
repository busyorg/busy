import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import SteemConnect from '../steemConnectAPI';
import './ErrorPage.less';

const Error401 = ({ staticContext }) => {
  if (staticContext) {
    staticContext.status = 401; // eslint-disable-line no-param-reassign
  }
  return (
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
};

Error401.propTypes = {
  staticContext: PropTypes.shape(),
};

Error401.defaultProps = {
  staticContext: null,
};

export default withRouter(Error401);
