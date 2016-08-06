var React = require("react"),
	Header = require("./../containers/header");

module.exports = React.createClass({
	render: function(){
		return (
			<div className="main-panel">
				<Header menu="chat" />
			</div>
		);
	}
});