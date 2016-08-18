var React = require("react"),
	Link = require("react-router").Link;

module.exports = React.createClass({
	render: function(){
		return (
			<div className="triggers">
				{this.props.edit && <a href="#edit" className="trigger"><i className="icon icon-md material-icons">format_paint</i></a>}
				{this.props.likes && <a href="#replies" className="trigger"><i className="icon icon-md material-icons">thumb_up</i></a>}
				{this.props.replies && <a href="#replies" className="trigger"><i className="icon icon-md material-icons">reply</i></a>}
				{this.props.messages && <a href="#messages" className="trigger"><i className="icon icon-md material-icons">chat_bubble_outline</i></a>}
				{this.props.add && <a href="#add" className="trigger"><i className="icon icon-md material-icons">add</i></a>}
			</div>
		);
	}
});