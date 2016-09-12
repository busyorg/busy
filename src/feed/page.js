var React = require('react'),
	_ = require('lodash'),
	Header = require('./../app/header'),
  PageActions = require('./../app/PageActions');

import Feed from './feed';

module.exports = React.createClass({
	render: function(){
		return (
			<div className="main-panel">
				<PageActions messages="true" add="true" />
				<Header account={this.props.account} category={this.props.category} />
				<div><div style={{height: '20px', overflow: 'hidden'}}></div></div>
				<Feed path={this.props.path} sortBy={this.props.sortBy} replies="false" />
			</div>
		);
	}
});
