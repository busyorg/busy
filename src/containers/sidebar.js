var React = require("react"),
	ReactRedux = require("react-redux"),
	actions = require("./../actions"),
	parser = require("./../../lib/parser"),
	_ = require('lodash'),
	axios = require('axios'),
	sortBy = require('sort-by'),
	numeral = require('numeral'),
	Loading = require("./../containers/loading"),
	Link = require("react-router").Link;

var Sidebar = React.createClass({
	componentWillMount: function() {
		this.setState({
			isFetching: false,
			isLoaded: false,
			categories: [],
			props: {},
			feedPrice: {}
		});
		this._getState('trending/busy');
	},
	_getState: function(path) {
		this.setState({
			isFetching: true,
			isLoaded: false
		});
		axios.get('//api.steemjs.com/getState?path=' + path)
			.then(response => {
				this.setState({
					isFetching: false,
					isLoaded: true,
					categories: response.data.categories,
					props: response.data.props,
					feedPrice: response.data.feed_price
				});
			});
	},
	render: function(){
		var user = this.props.auth.user;
		var tags = [];
		if (this.state.categories) {
			var categories = _.sortBy(this.state.categories, 'discussions').reverse();
			categories.forEach(function(category, key) {
				tags.push(<li key={key}><Link to={'/trending/' + category.name} activeClassName="active">#{category.name}</Link></li>);
			});
		}
		tags = tags.sort(sortBy('discussions'));
		tags = tags.slice(0, 20);
		if (_.has(this.state.feedPrice, 'base')) {
			var vests = user.vesting_shares;
			var totalVest = this.state.props.total_vesting_shares;
			var power = parseFloat(this.state.props.total_vesting_fund_steem) * (parseFloat(vests) / parseFloat(totalVest));
			var base = (this.state.feedPrice.base).replace(' SBD', '').replace(',', '');
			var dollar = (parseFloat(base) * (parseFloat(user.balance) + parseFloat(power))) + parseFloat(user.sbd_balance);
		}
		return (
			<nav className="sidebar">
				{this.props.app.sidebarIsVisible && <a className="visible-xs hide-sidebar" href="#" onClick={() => this.props.hideSidebar()}><i className="icon icon-md icon-menu material-icons">arrow_back</i></a>}
				<div className="sidebar-header">
					{this.props.auth.isAuthenticated? <div className="me">
						<Link to={'/@' + user.name}>
							<span className="avatar avatar-sm">
								<span className="reputation">{parser.reputation(user.reputation)}</span>
								<img src={'https://img.busy6.com/@' + user.name} />
							</span>
							<span style={{clear: 'both', display: 'block'}}>@{user.name}</span>
						</Link>
					</div> : <div className="login">
						<a href="https://steemconnect.com/authorize/@busy"><i className="icon icon-md material-icons">lock_outline</i> Steem Connect</a>
					</div>}
				</div>
				<div className="sidebar-content">
					{this.props.auth.isAuthenticated && <ul className="list-selector">
						<li><Link to="/trending" className="active"><i className="icon icon-md material-icons">public</i> World</Link></li>
						<li><Link to={'/@' + user.name + '/feed'} className="active"><i className="icon icon-md material-icons">people</i> Friends</Link></li>
					</ul>}
					{this.state.isFetching && <Loading color="white"/>}
					{_.size(this.state.categories) > 0 && <ul className="tags">{tags}</ul>}
					{_.size(this.props.auth.following) > 0 &&
						<ul className="tags">
							<li>Following 1</li>
							<li>Following 2</li>
						</ul>
					}
					<div className="menu">
					{this.props.auth.isAuthenticated && <div>
							<div className="title"><Link to={'/@' + this.props.auth.user.name + '/wallet'}><i className="icon icon-md material-icons">account_balance_wallet</i> Balances</Link></div>
							<div className="balance">
								<div>{numeral(user.balance).format('0,0.00')} Steem</div>
								{_.has(this.state.feedPrice, 'base') && <div>{numeral(power).format('0,0.00')} Steem Power</div>}
								<div>{numeral(user.sbd_balance).format('0,0.00')} Steem Dollars</div>
								{_.has(this.state.feedPrice, 'base') && <div>{numeral(dollar).format('$0,0.00')} Steem Dollars</div>}
								{_.has(this.state.feedPrice, 'base') && <div>1 Steem = {numeral(base).format('$0,0.00')}</div>}
							</div>
						</div>}
						<div className="title"><Link to="/about"><i className="icon icon-md material-icons">info_outline</i> About</Link></div>
					</div>
				</div>
			</nav>
		);
	}
});

var mapStateToProps = function(state){
	return {
		app: state.app,
		auth: state.auth
	};
};

var mapDispatchToProps = function(dispatch){
	return {
		hideSidebar: function(){ dispatch(actions.hideSidebar()); }
	}
};

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(Sidebar);