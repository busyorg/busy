import React from 'react';
import Page from '../feed/Page';

module.exports = React.createClass({
  render() {
    const account = this.props.params.name;
    return (
      <Page account={account} path={`@${account}/recent-replies`} />
    );
  }
});
