var React = require('react'),
	_ = require('lodash'),
	Header = require('./../../containers/header'),
	Followed = require('./../../containers/followed');

module.exports = React.createClass({
	render: function(){
		return (
			<div className="main-panel">
				<Header account={this.props.account} />
				<div><div style={{height: '20px', overflow: 'hidden'}}></div></div>
				<div className="container"><Followed username={this.props.account} /></div>
			</div>
		);
	}
});