var React = require('react'),
  _ = require('lodash'),
  Header = require('./../app/header'),
  Followers = require('./followers');

module.exports = React.createClass({
  render: function(){
    return (
      <div className="main-panel">
        <Header account={this.props.name} />
        <div className="container"><Followers username={this.props.params.name} /></div>
      </div>
    );
  }
});
