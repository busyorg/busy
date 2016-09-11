var React = require('react'),
	ReactRedux = require('react-redux'),
	steemConnect = require('steemconnect'),
	numeral = require('numeral'),
	actions = require('./../actions'),
	Link = require('react-router').Link;

var Actions = React.createClass({
	getInitialState: function() {
		return {
			voted: false
		};
	},
	componentWillMount: function() {
		if (this.props.auth.isAuthenticated) {
			this.props.post.active_votes.forEach(function(entry, key) {
				if (entry.voter == this.props.auth.user.name) {
					this.setState({voted: true});
				}
			}.bind(this));
		}
	},
	vote: function(voter, author, permlink, weight){
		if (this.props.auth.isAuthenticated) {
			steemConnect.vote(voter, author, permlink, weight, function(err, result) {
				if (!err) this.setState({voted: true});
			}.bind(this));
		}
	},
	init: function() {

	},
	render: function() {
		var voter = (this.props.auth.isAuthenticated)? this.props.auth.user.name : '';
		var post = this.props.post;
		var payout = parseFloat(post.total_payout_value) + parseFloat(post.total_pending_payout_value);
		return (<ul>
				<li><a onClick={() => this.vote(voter, post.author, post.permlink, 10000)} className={this.state.voted? 'active' : ''}><i className="icon icon-sm material-icons">thumb_up</i></a> {numeral(post.net_votes).format('0,0')}<span className="hidden-xs"> Likes</span></li>
				<li><span className="hidden-xs"><i className="icon icon-sm material-icons">attach_money</i> </span>{numeral(payout).format('$0,0.00')}</li>
				<li><a href="#"><i className="icon icon-sm material-icons">comment</i></a> {numeral(post.children).format('0,0')}<span className="hidden-xs"> Comments</span></li>
				<li><a href="#"><i className="icon icon-sm material-icons">send</i><span className="hidden-xs"> Share</span></a></li>
			</ul>);
	}
});

var mapStateToProps = function(state){
	return {
		auth: state.auth
	};
};

var mapDispatchToProps = function(dispatch){
	return {}
};

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(Actions);
