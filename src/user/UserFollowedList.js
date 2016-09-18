var React = require('react'),
  _ = require('lodash'),
  Header = require('./../app/header'),
  Followed = require('./followed');

module.exports = React.createClass({
  render: function(){
    return (
      <div className="main-panel">
        <Header account={this.props.params.name} />
        <div className="container"><Followed username={this.props.params.name} /></div>
      </div>
    );
  }
});
