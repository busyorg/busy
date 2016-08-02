var React = require("react"),
	ReactRedux = require("react-redux"),
	actions = require("../actions"),
	_ = require('lodash'),
	sortBy = require('sort-by'),
	numeral = require('numeral'),
	Loading = require("./../containers/loading"),
	Link = require("react-router").Link;

var Sidebar = React.createClass({
	render: function(){
		var current = this.props.pages.current;
		var tags = [];
		if (current.categories) {
			Object.keys(this.props.pages.current.categories).forEach(function(category) {
				tags.push(<li><Link to={'/trending/' + category} activeClassName="active">#{category}</Link></li>);
			});
		}
		tags = tags.sort(sortBy('discussions'));
		tags = tags.slice(0, 20);
		var power = parseFloat(this.props.auth.user.vesting_shares)/3910.751458717383;
		return (
			<nav className="sidebar">
				<div className="sidebar-header">
					{this.props.auth.isAuthenticated && <div className="avatar">
						<div className="name">
							<i className="icon icon-md material-icons">perm_identity</i>
							<Link to={'/@' + this.props.auth.user.name}>@{this.props.auth.user.name}</Link>
						</div>
					</div>}
				</div>
				{tags && <ul className="sidebar-content">{tags}</ul>}
				<div className="sidebar-footer">
					{this.props.auth.isAuthenticated && <div className="avatar">
						<div className="balance">
							<div>Balances</div>
							<div>{numeral(this.props.auth.user.balance).format('0,0.00')} Steem</div>
							<div>{numeral(power).format('0,0.00')} Steem Power</div>
							<div>{numeral(this.props.auth.user.sbd_balance).format('0,0.00')} Steem Dollars</div>
						</div>
					</div>}
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