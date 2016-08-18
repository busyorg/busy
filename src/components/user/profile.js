var React = require('react'),
	ReactRedux = require('react-redux'),
	_ = require('lodash'),
	steem = require('./../../../lib/steem'),
	numeral = require('numeral'),
	moment = require('moment'),
	actions = require('../../actions'),
	parser = require('../../../lib/parser'),
	Triggers = require('./../../containers/triggers'),
	Header = require('./../../containers/header'),
	Feed = require('./../../containers/feed/feed'),
	Loading = require('./../../containers/loading'),
	Link = require('react-router').Link;

var Profile = React.createClass({
	componentWillMount: function() {
		this.props.setMenu('secondary');
		this.setState({account: {}});
		steem.getAccount(this.props.params.name, function(err, account) {
			this.setState({account: account});
		}.bind(this));
	},
	componentWillReceiveProps: function(nextProps) {
		this.props.setMenu('secondary');
		this.setState({account: {}});
		steem.getAccount(this.props.params.name, function(err, account) {
			this.setState({account: account});
		}.bind(this));
	},
	render: function(){
		var username = this.props.params.name;
		var account = this.state.account;
		var edit = (this.props.auth.isAuthenticated && username == this.props.auth.user.name);
		return (
			<div className="main-panel">
				<Triggers messages={!edit} edit={edit} />
				<Header account={username} />
				<section className="align-center bg-green profile-header"
          style={{backgroundImage: 'url(https://img.busy6.com/@' + username + '/cover)', backgroundSize: 'cover'}}>
					{_.has(account, 'name') && <div className="activity container row">
							<div className="col col-lg-6">Created {moment(account.created).fromNow()}</div>
							<div className="col col-lg-6">Last Active {moment(account.last_active).fromNow()}</div>
						</div>}
					<div className="pal">
						<div className="mvl">
							<div className="avatar avatar-xl">
								{_.has(account, 'name') && <div className="reputation">{parser.reputation(account.reputation)}</div>}
								<img src={'https://img.busy6.com/@' + username} />
							</div>
							<h1>@{username}</h1>
						</div>
					</div>
				</section>
				<div className="profile">
					{!_.has(account, 'name') && <Loading />}
					{_.has(account, 'name') && <div>
						<ul className="secondary-nav">
							<li><i className="icon icon-md material-icons">library_books</i> {numeral(account.post_count).format('0,0')}<span className="hidden-xs"> Posts</span></li>
							<li><i className="icon icon-md material-icons">gavel</i> {numeral(parseInt(account.voting_power) / 10000).format('%0')}<span className="hidden-xs"> Voting Power</span></li>
							<li><Link to={'/@' + username + '/followers'}><i className="icon icon-md material-icons">people</i> {numeral(parseInt(0)).format('0,0')}<span className="hidden-xs"> Followers</span></Link></li>
							<li><Link to={'/@' + username + '/followed'}><i className="icon icon-md material-icons">people</i> {numeral(parseInt(0)).format('0,0')}<span className="hidden-xs"> Followed</span></Link></li>
						</ul>
						<div className="container"></div>
					</div>}
					<div><div style={{height: '20px', overflow: 'hidden'}}></div></div>
					<Feed path={'@' + username + '/posts'} sortBy="created" limit="1" />
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