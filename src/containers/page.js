var React = require('react'),
	_ = require('lodash'),
	Header = require('./header'),
	Triggers = require('./triggers'),
	Feed = require('./feed/feed');

module.exports = React.createClass({
	render: function(){
		return (
			<div className="main-panel">
				<Triggers chat="true" add="true" />
				<Header account={this.props.account} category={this.props.category} />
				<div><div style={{height: '20px', overflow: 'hidden'}}></div></div>
				<Feed path={this.props.path} />
			</div>
		);
	}
});