var React = require('react'),
	ReactRedux = require('react-redux'),
	_ = require('lodash'),
	numeral = require('numeral'),
	axios = require('axios'),
	C = require('./../../constants'),
	BodyShort = require('./body-short'),
	Loading = require("./../loading"),
	Link = require('react-router').Link;

var Comments = React.createClass({
	componentWillMount: function() {
		this.setState({replies: []});
		this.getContentReplies();
	},
	getContentReplies: function() {
		var parent = this.props.parent;
		var parentPermlink = this.props.parentPermlink;
		axios.get('//api.steemjs.com/getContentReplies?parent=' + parent + '&parentPermlink=' + parentPermlink + '&ws=' + C.WS)
			.then(response => {
				this.setState({replies: response.data});
			});
	},
	render: function(){
		return (
			<div className="comments">
				{this.state.replies.length > 0 && <ul>
					{this.state.replies.slice(0,3).map(function(reply, key) {
						var payout = parseFloat(reply.total_payout_value) + parseFloat(reply.total_pending_payout_value);
						return <li key={key}><Link to={'/@' + reply.author}>@{reply.author}</Link> <b>{numeral(payout).format('$0,0.00')}</b> <BodyShort body={reply.body} /></li>;
					})}
				</ul>}
				{this.state.replies.length == 0 && <Loading />}
			</div>
		);
	}
});

var mapStateToProps = function(state){
	return {
		auth: state.auth
	};
};

module.exports = ReactRedux.connect(mapStateToProps)(Comments);