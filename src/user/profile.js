var React = require('react'),
	ReactRedux = require('react-redux'),
	_ = require('lodash'),
	api = require('./../steemAPI'),
	formatter = require('steem/lib/formatter'),
	numeral = require('numeral'),
	moment = require('moment'),
	actions = require('../actions'),
  PageActions = require('./../app/PageActions'),
	Header = require('./../app/header'),
	Loading = require('./../widgets/Loading'),
	Link = require('react-router').Link;

import Feed from './../feed/feed';

var Profile = React.createClass({
	componentWillMount: function() {
		this.props.setMenu('secondary');
		this.setState({
			account: {},
			followersCount: 0,
			followingCount: 0
		});
		this._init();
	},
	componentWillReceiveProps: function(nextProps) {
		this.props.setMenu('secondary');
		this.setState({
			account: {},
			followersCount: 0,
			followingCount: 0
		});
		this._init();
	},
	_init: function(){
		var username = this.props.params.name;
		api.getAccounts([username], function(err, result) {
			this.setState({account: result[0]});
		}.bind(this));
		api.getFollowers(username, 0, 'blog', 100, function(err, result) {
			this.setState({followersCount: _.size(result)});
		}.bind(this));
		api.getFollowing(username, 0, 'blog', 100, function(err, result) {
			this.setState({followingCount: _.size(result)});
		}.bind(this));
	},
	render: function(){
		var username = this.props.params.name;
		var account = this.state.account;
		try { var jsonMetadata = JSON.parse(account.json_metadata); }
		catch(e) { var jsonMetadata = {}; }
		var edit = (this.props.auth.isAuthenticated && username == this.props.auth.user.name);
		return (
			<div className="main-panel">
				<PageActions messages={!edit} edit={edit} />
				<Header account={username} />
				<section className="align-center bg-green profile-header"
          style={{backgroundImage: 'url(https://img.busy6.com/@' + username + '/cover)', backgroundSize: 'cover'}}>
					<div className="mvl">
						<div className="avatar avatar-xl">
							{_.has(account, 'name') && <div className="reputation">{formatter.reputation(account.reputation)}</div>}
							<img src={'https://img.busy6.com/@' + username} />
						</div>
						<h1>{_.has(jsonMetadata, 'profile.name')? jsonMetadata.profile.name : '@' + username}</h1>
					</div>
				</section>
				<div className="profile">
					{!_.has(account, 'name') && <Loading />}
					{_.has(account, 'name') && <div>
						<ul className="secondary-nav">
							<li><i className="icon icon-md material-icons">library_books</i> {numeral(account.post_count).format('0,0')}<span className="hidden-xs"> Posts</span></li>
							<li><i className="icon icon-md material-icons">gavel</i> {numeral(parseInt(account.voting_power) / 10000).format('%0')}<span className="hidden-xs"> Voting Power</span></li>
							<li><Link to={'/@' + username + '/followers'}><i className="icon icon-md material-icons">people</i> {numeral(parseInt(this.state.followersCount)).format('0,0')}<span className="hidden-xs"> Followers</span></Link></li>
							<li><Link to={'/@' + username + '/followed'}><i className="icon icon-md material-icons">people</i> {numeral(parseInt(this.state.followingCount)).format('0,0')}<span className="hidden-xs"> Followed</span></Link></li>
						</ul>
						<center className="mal">
							{_.has(jsonMetadata, 'profile.about') && <h3>{jsonMetadata.profile.about}</h3>}
							{_.has(jsonMetadata, 'profile.website') && <p><i className="icon icon-md material-icons">link</i> <a href={jsonMetadata.profile.website} target="_blank">{jsonMetadata.profile.website}</a></p>}
							{_.has(jsonMetadata, 'profile.location') && <p><i className="icon icon-md material-icons">pin_drop</i> {jsonMetadata.profile.location}</p>}
							{_.has(account, 'name') && <p>
								<span>Joined {moment(account.created).fromNow()}</span> <span>, last activity {moment(account.last_active).fromNow()}</span>
							</p>}
						</center>
					</div>}
					<div><div style={{height: '20px', overflow: 'hidden'}}></div></div>
					<Feed path={'@' + username} sortBy="created" replies="false" />
				</div>
			</div>
		);
	}
});

var mapStateToProps = function(state){
	return {
		auth: state.auth
	};
};

var mapDispatchToProps = function(dispatch){
	return {
		setMenu: function(menu){ dispatch(actions.setMenu(menu)); }
	}
};

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(Profile);
