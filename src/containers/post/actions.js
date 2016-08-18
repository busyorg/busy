var React = require('react'),
	numeral = require('numeral');

module.exports = React.createClass({
	render: function(){
		var post = this.props.post;
		var payout = parseFloat(post.total_payout_value) + parseFloat(post.total_pending_payout_value);
		return (<ul>
				<li><a href="#"><i className="icon icon-sm material-icons">thumb_up</i></a> {numeral(post.net_votes).format('0,0')}<span className="hidden-xs"> Likes</span></li>
				<li><span className="hidden-xs"><i className="icon icon-sm material-icons">attach_money</i> </span>{numeral(payout).format('$0,0.00')}</li>
				<li><a href="#"><i className="icon icon-sm material-icons">comment</i></a> {numeral(post.children).format('0,0')}<span className="hidden-xs"> Comments</span></li>
				<li><a href="#"><i className="icon icon-sm material-icons">send</i><span className="hidden-xs"> Share</span></a></li>
			</ul>);
	}
});