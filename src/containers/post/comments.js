var React = require('react'),
	ReactRedux = require('react-redux'),
	steem = require('./../../../lib/steem'),
	_ = require('lodash'),
	numeral = require('numeral'),
	BodyShort = require('./body-short'),
	Loading = require("./../loading"),
	Link = require('react-router').Link;

var Comments = React.createClass({
	componentWillMount: function() {
		this.setState({replies: []});
		steem.getContentReplies(this.props.parent, this.props.parentPermlink, function(err, replies) {
			this.setState({replies: replies});
		}.bind(this));
	},
	render: function(){
		return (
			<div className="comments">
				{this.state.replies.length > 0 && <ul>
					{this.state.replies.slice(0,3).map(function(reply, key) {
						return <Comment key={key} reply={reply} />;
					})}
				</ul>}
				{this.state.replies.length == 0 && <Loading />}
			</div>
		);
	}
});

var Comment = React.createClass({
	render: function(){
		var reply = this.props.reply;
		var payout = parseFloat(reply.total_payout_value) + parseFloat(reply.total_pending_payout_value);
		return (
			<li>
				<Link to={'/@' + reply.author}>@{reply.author}</Link> <b>{numeral(payout).format('$0,0.00')}</b> <BodyShort body={reply.body} />
			</li>
		);
	}
});

var mapStateToProps = function(state){
	return {
		auth: state.auth
	};
};

module.exports = ReactRedux.connect(mapStateToProps)(Comments);