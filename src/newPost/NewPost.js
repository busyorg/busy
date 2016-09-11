var React = require("react"),
	Header = require("./../app/header"),
	Post = require('./../form/post');

module.exports = React.createClass({
	render: function(){
		return (
			<div className="main-panel">
				<Header menu="messages" />
				<div className="container"><Post /></div>
			</div>
		);
	}
});
