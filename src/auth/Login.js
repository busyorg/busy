import React from 'react';
import steemconnect from 'steemconnect';

import './Login.sass';

module.exports = React.createClass({
  render() {
    const url = steemconnect.getLoginUrl(process.env.STEEMCONNECT_REDIRECT_URL);
    return (
      <iframe className="Login__iframe" src={url}></iframe>
    );
  }
});
