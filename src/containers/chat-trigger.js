var React = require("react"),
	Link = require("react-router").Link;

module.exports = React.createClass({
	render: function(){
		return (
			<div className="chat-trigger">
				<Link to="/chat"><i className="icon icon-lg material-icons">chat</i></Link>
			</div>
		);
	}
});