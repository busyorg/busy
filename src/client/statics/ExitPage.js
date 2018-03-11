import React from 'react';
import PropTypes from 'prop-types';
import 'url-search-params-polyfill';

const ExitPage = ({ location }) => {
  const url = new URLSearchParams(location.search).get('url');

  if (!url) {
    return null;
  }

  return (
    <div className="container">
      <h2>You are leaving Busy.org</h2>
      <pre>{url}</pre>
      <a href={url}>go</a>
    </div>
  );
};
ExitPage.propTypes = {
  location: PropTypes.shape().isRequired,
};

export default ExitPage;
