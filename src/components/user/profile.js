var React = require("react"),
	ReactRedux = require("react-redux"),
	_ = require('lodash'),
	numeral = require('numeral'),
	actions = require("../../actions"),
	Header = require("./../../containers/header"),
	Loading = require("./../../containers/loading");

var Profile = React.createClass({
	getInitialState: function() {
		this.props.setMenu('secondary');
		this.props.getAccount(this.props.params.name);
		return {
			key: Math.random()
		};
	},
	render: function(){
		var account = this.props.params.name;
		var profile = this.props.pages.profile;
		var reputation = (_.size(profile.account) > 0)? parseInt(profile.account.reputation)/100000000000 : '';
		reputation = Number(reputation).toFixed(0);
		return (
			<div className="main-panel">
				<Header account={account} />
				<section className="align-center bg-green">
					<div className="pal">
						<div className="mvl">
							<div className="avatar avatar-xl">
								{_.size(profile.account) > 0 && <div className="reputation">{reputation}</div>}
								<img src="/img/logo-white.svg" />
							</div>
							<h1>@{account}</h1>
						</div>
					</div>
				</section>
				<div className="profile">
					{profile && this.props.app.isFetching && <Loading />}
					{profile && !this.props.app.isFetching && _.size(profile.account) > 0 &&
							<ul className="secondary-nav">
								<li><i className="icon icon-md icon-menu material-icons">library_books</i> {numeral(profile.account.post_count).format('0,0')}<span className="hidden-xs"> Posts</span></li>
								<li><i className="icon icon-md icon-menu material-icons">gavel</i> {numeral(parseInt(profile.account.voting_power) / 10000).format('%0')}<span className="hidden-xs"> Voting Power</span></li>
								<li><i className="icon icon-md icon-menu material-icons">people</i> {numeral(parseInt(0)).format('0,0')}<span className="hidden-xs"> Followers</span></li>
								<li><i className="icon icon-md icon-menu material-icons">people</i> {numeral(parseInt(0)).format('0,0')}<span className="hidden-xs"> Followed</span></li>
							</ul>}
				</div>
			</div>
		);
	}
});

var mapStateToProps = function(state){
	return {
		app: state.app,
		pages: state.pages
	};
};

var mapDispatchToProps = function(dispatch){
	return {
		setMenu: function(menu){ dispatch(actions.setMenu(menu)); },
		getAccount: function(name){ dispatch(actions.getAccount(name)); }
	}
};

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(Profile);