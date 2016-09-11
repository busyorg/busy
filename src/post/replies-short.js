var React = require('react'),
	api = require('./../steemAPI'),
	ReplyShort = require('./reply-short'),
	Loading = require("./../widgets/Loading");

module.exports = React.createClass({
	componentWillMount: function() {
		this.setState({replies: []});
		api.getContentReplies(this.props.parent, this.props.parentPermlink, function(err, replies) {
			this.setState({replies: replies});
		}.bind(this));
	},
	render: function(){
		return (
			<div className="replies">
				{this.state.replies.length > 0 && <ul>
					{this.state.replies.slice(0,3).map(function(reply, key) {
						return <ReplyShort key={key} reply={reply} />;
					})}
				</ul>}
				{this.state.replies.length == 0 && <Loading />}
			</div>
		);
	}
});
