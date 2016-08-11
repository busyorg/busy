var React = require("react"),
	ReactRedux = require('react-redux'),
	Header = require("./../../containers/header"),
	Link = require('react-router').Link;

module.exports = React.createClass({
	getInitialState: function() {
		return {
			key: Math.random()
		};
	},
	render: function(){
		return (
			<div className="main-panel">
				<Header menu="about" />
				<div><div style={{height: '20px', overflow: 'hidden'}}></div></div>
				<div className="page">
					<div className="block">
						<h1>Jobs</h1>
					</div>
				</div>
			</div>
		);
	}
});