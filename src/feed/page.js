var React = require('react'),
  _ = require('lodash'),
  Header = require('./../app/header'),
  PageActions = require('./../app/PageActions');

import Feed from './feed';

module.exports = React.createClass({
  render: function(){
    return (
      <div className="main-panel">
        <PageActions params={this.props.params} messages="true" add="true" />
        <Header account={this.props.account} category={this.props.category} />
        <Feed path={this.props.path} sortBy={this.props.sortBy} replies="false" />
      </div>
    );
  }
});
