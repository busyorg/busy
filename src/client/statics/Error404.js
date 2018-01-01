import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { withRouter, Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import './ErrorPage.less';

const Error404 = ({ intl, staticContext }) => {
  if (staticContext) {
    staticContext.status = 404; // eslint-disable-line no-param-reassign
  }
  return (
    <div className="ErrorPage container">
      <Helmet>
        <title>
          {intl.formatMessage({ id: 'page_not_found', defaultMessage: 'Page not found' })} - Busy
        </title>
      </Helmet>
      <h1>
        <FormattedMessage id="page_not_found" defaultMessage="Page not found" />
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
};

Error404.propTypes = {
  intl: PropTypes.shape().isRequired,
  staticContext: PropTypes.shape(),
};

Error404.defaultProps = {
  staticContext: null,
};

export default withRouter(injectIntl(Error404));
