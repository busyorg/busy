import React from 'react';
import Header from './../app/header';
import Followers from './Followers';

module.exports = React.createClass({
  render() {
    return (
      <div>
        <Header account={this.props.name} />
        <div className="container"><Followers username={this.props.params.name} /></div>
      </div>
    );
  }
});
