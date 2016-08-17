var React = require('react'),
	Header = require('./../containers/header'),
	Link = require('react-router').Link;

module.exports = React.createClass({
	render: function(){
		return (
			<div className="main-panel">
				<Header menu="about" />
				<div><div style={{height: '20px', overflow: 'hidden'}}></div></div>
				<div className="page">
					<div className="block"><h1>Settings</h1></div>
				</div>
			</div>
		);
	}
});