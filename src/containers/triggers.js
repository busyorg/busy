var React = require("react"),
	Link = require("react-router").Link;

module.exports = React.createClass({
	render: function(){
		return (
			<div className="triggers">
				{this.props.replies && <Link to="/replies" className="trigger"><i className="icon icon-md material-icons">reply</i></Link>}
				{this.props.chat && <Link to="/chat" className="trigger"><i className="icon icon-md material-icons">chat_bubble_outline</i></Link>}
				{this.props.add && <Link to="/chat" className="trigger"><i className="icon icon-md material-icons">add</i></Link>}
			</div>
		);
	}
});