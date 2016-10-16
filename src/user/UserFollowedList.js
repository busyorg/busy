import React from 'react';
import Header from './../app/header';
import Followed from './followed';

module.exports = React.createClass({
  render() {
    return (
      <div>
        <Header account={this.props.params.name} />
        <div className="container"><Followed username={this.props.params.name} /></div>
      </div>
    );
  }
});
