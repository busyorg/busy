import React from 'react';

import './Login.scss';

module.exports = React.createClass({
  render() {
    const url = `${process.env.STEEMCONNECT_HOST}/authorize/@busy.app?redirect_url=${process.env.STEEMCONNECT_REDIRECT_URL}`;
    return (
      <iframe className="Login__iframe" src={url}></iframe>
    );
  }
});
