var React = require('react'),
	ReactRedux = require('react-redux'),
	_ = require('lodash'),
	numeral = require('numeral'),
	moment = require('moment'),
	actions = require('../../actions'),
	parser = require('../../../lib/parser'),
	Triggers = require('./../../containers/triggers'),
	Header = require('./../../containers/header'),
	Loading = require('./../../containers/loading');

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
		return (
			<div className="main-panel">
				<Triggers chat="true" />
				<Header account={account} />
				<section className="align-center bg-green profile-header"
          style={{backgroundImage: 'url(https://img.busy6.com/@' + account + '/cover)', backgroundSize: 'cover'}}>
					{profile && !this.props.app.isFetching && _.size(profile.account) > 0 &&
						<div className="activity container row">
							<div className="col col-lg-6">Created {moment(profile.account.created).fromNow()}</div>
							<div className="col col-lg-6">Last Active {moment(profile.account.last_active).fromNow()}</div>
						</div>}
					<div className="pal">
						<div className="mvl">
							<div className="avatar avatar-xl">
								{profile && !this.props.app.isFetching && _.size(profile.account) > 0 && <div className="reputation">{parser.reputation(profile.account.reputation)}</div>}
								<img src={'https://img.busy6.com/@' + account} />
							</div>
							<h1>@{account}</h1>
						</div>
					</div>
				</section>
				<div className="profile">
					{profile && this.props.app.isFetching && <Loading />}
					{profile && !this.props.app.isFetching && _.size(profile.account) > 0 && <div>
						<ul className="secondary-nav">
							<li><i className="icon icon-md material-icons">library_books</i> {numeral(profile.account.post_count).format('0,0')}<span className="hidden-xs"> Posts</span></li>
							<li><i className="icon icon-md material-icons">gavel</i> {numeral(parseInt(profile.account.voting_power) / 10000).format('%0')}<span className="hidden-xs"> Voting Power</span></li>
							<li><i className="icon icon-md material-icons">people</i> {numeral(parseInt(0)).format('0,0')}<span className="hidden-xs"> Followers</span></li>
							<li><i className="icon icon-md material-icons">people</i> {numeral(parseInt(0)).format('0,0')}<span className="hidden-xs"> Followed</span></li>
						</ul>
						<div className="container"></div>
					</div>}
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