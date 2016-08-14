var React = require('react'),
	_ = require('lodash'),
	Header = require('./../../containers/header'),
	Followers = require('./../../containers/followers');

module.exports = React.createClass({
	render: function(){
		return (
			<div className="main-panel">
				<Header account={this.props.account} />
				<div><div style={{height: '20px', overflow: 'hidden'}}></div></div>
				<div className="container"><Followers username={this.props.account} /></div>
			</div>
		);
	}
});