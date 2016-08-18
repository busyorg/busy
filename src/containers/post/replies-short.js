var React = require('react'),
	steem = require('./../../../lib/steem'),
	Reply = require('./reply'),
	Loading = require("./../loading");

module.exports = React.createClass({
	componentWillMount: function() {
		this.setState({replies: []});
		steem.getContentReplies(this.props.parent, this.props.parentPermlink, function(err, replies) {
			this.setState({replies: replies});
		}.bind(this));
	},
	render: function(){
		return (
			<div className="replies">
				{this.state.replies.length > 0 && <ul>
					{this.state.replies.slice(0,3).map(function(reply, key) {
						return <Reply key={key} reply={reply} />;
					})}
				</ul>}
				{this.state.replies.length == 0 && <Loading />}
			</div>
		);
	}
});