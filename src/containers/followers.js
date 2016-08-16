var React = require('react'),
	ReactRedux = require('react-redux'),
	_ = require('lodash'),
	steem = require('./../../lib/steem'),
	Loading = require("./loading"),
	Link = require('react-router').Link;

var Followers = React.createClass({
	componentWillMount: function() {
		this.setState({users: []});
		steem.getFollowers(this.props.username, '', '', '', function(err, followers) {
			this.setState({users: followers});
		}.bind(this));
	},
	render: function(){
		return (
			<center className="users">
				{this.state.users.length > 0 && <ul>
					{this.state.users.map(function(user, key) {
						return <li key={key}>
							<div className="avatar avatar-xl">
								<img src={'https://img.busy6.com/@' + user.follower} />
							</div>
							<div><Link to={'/@' + user.follower}>@{user.follower}</Link></div>
						</li>;
					})}
				</ul>}
				{this.state.users.length == 0 && <Loading />}
			</center>
		);
	}
});

var mapStateToProps = function(state){
	return {
		auth: state.auth
	};
};

module.exports = ReactRedux.connect(mapStateToProps)(Followers);