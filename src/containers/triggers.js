var React = require('react'),
	Reply = require('./../form/reply'),
	{Link} = require('react-router');

module.exports = React.createClass({
	render: function(){
		return (
			<div className="actions">
				<div className="triggers">
					{this.props.edit && <Link to="/profile/edit" className="trigger"><i className="icon icon-md material-icons">format_paint</i></Link>}
					{this.props.likes && <a href="#replies" className="trigger"><i className="icon icon-md material-icons">thumb_up</i></a>}
					{this.props.replies && <a href="#replies" className="trigger"><i className="icon icon-md material-icons">reply</i></a>}
					{this.props.messages && <a href="#messages" className="trigger"><i className="icon icon-md material-icons">chat_bubble_outline</i></a>}
					{this.props.add && <Link to="/write" className="trigger"><i className="icon icon-md material-icons">add</i></Link>}
				</div>
			</div>
		);
	}
});