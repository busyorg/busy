import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import 'url-search-params-polyfill';
import ActionLink from '../components/Button/ActionLink';
import './ExitPage.less';

const ExitPage = ({ location }) => {
  const url = new URLSearchParams(location.search).get('url');

  if (!url) {
    return null;
  }

  return (
    <div className="ExitPage container">
      <h2>
        <FormattedMessage id="page_exit" defaultMessage="You are leaving Busy.org" />
      </h2>
      <FormattedMessage
        id="page_exit_message"
        defaultMessage="You are about to go to external website. Please be careful when sharing your credentials."
      />
      <pre>{url}</pre>
      <ActionLink style={{ width: 'auto' }} primary href={url}>
        <FormattedMessage id="page_exit_go" defaultMessage="Visit this website" />
      </ActionLink>
    </div>
  );
};
ExitPage.propTypes = {
  location: PropTypes.shape().isRequired,
};

export default ExitPage;
