var React = require("react"),
	ReactRedux = require("react-redux"),
	_ = require('lodash'),
	sortBy = require('sort-by'),
	numeral = require('numeral'),
	Loading = require("./../containers/loading"),
	Link = require("react-router").Link;
var Sidebar = React.createClass({
	render: function(){
		var current = this.props.pages.current;
		var user = this.props.auth.user;
		var tags = [];
		if (current.categories) {
			var categories = _.sortBy(current.categories, 'discussions').reverse();
			categories.forEach(function(category) {
				tags.push(<li><Link to={'/trending/' + category.name} activeClassName="active">#{category.name}</Link></li>);
			});
		}
		tags = tags.sort(sortBy('discussions'));
		tags = tags.slice(0, 20);
		if (current.feed_price) {
			var vests = user.vesting_shares;
			var totalVest = current.props.total_vesting_shares;
			var power = parseFloat(current.props.total_vesting_fund_steem) * (parseFloat(vests) / parseFloat(totalVest));
			var base = (current.feed_price.base).replace(' SBD', '').replace(',', '');
			var dollar = (parseFloat(base) * (parseFloat(user.balance) + parseFloat(power))) + parseFloat(user.sbd_balance);

		}
		return (
			<nav className="sidebar">
				<div className="sidebar-header">
					{this.props.auth.isAuthenticated && <div className="me">
						<span className="avatar avatar-sm"><img src="/img/logo-white.svg" /></span>
						<div><Link to={'/@' + user.name}>@{user.name}</Link></div>
					</div>}
				</div>
				<div className="sidebar-content">
					<ul className="list-selector">
						<li><Link to="/trending" className="active"><i className="icon icon-md material-icons">public</i> World</Link></li>
						<li><span><i className="icon icon-md material-icons">people</i> Friends</span></li>
					</ul>
					{tags.length > 0 && <ul className="tags">{tags}</ul>}
					<div className="menu">
					{this.props.auth.isAuthenticated && <div>
							<div className="title"><i className="icon icon-md material-icons">account_balance_wallet</i> Balances</div>
							<div className="balance">
								<div>{numeral(user.balance).format('0,0.00')} Steem</div>
								{current.feed_price && <div>{numeral(power).format('0,0.00')} Steem Power</div>}
								<div>{numeral(user.sbd_balance).format('0,0.00')} Steem Dollars</div>
								{current.feed_price && <div>{numeral(dollar).format('$0,0.00')} Steem Dollars</div>}
								{current.feed_price && <div>1 Steem = {numeral(base).format('$0,0.00')}</div>}
							</div>
							<div className="title"><Link to="/about"><i className="icon icon-md material-icons">info_outline</i> About</Link></div>
						</div>}
					</div>
				</div>
			</nav>
		);
	}
});

var mapStateToProps = function(state){
	return {
		auth: state.auth,
		pages: state.pages
	};
};

module.exports = ReactRedux.connect(mapStateToProps)(Sidebar);