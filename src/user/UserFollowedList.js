import React from 'react';
import Header from './../app/header';
import Followed from './Followed';

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
