var React = require('react'),
	_ = require('lodash'),
	api = require('./../../steem/api'),
	Reply = require('./reply'),
	Loading = require("./../loading");

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
					{_.sortBy(this.state.replies, 'created').reverse().map(function(reply, key) {
						return <Reply key={key} reply={reply} />;
					})}
				</ul>}
				{this.state.replies.length == 0 && <Loading />}
			</div>
		);
	}
});