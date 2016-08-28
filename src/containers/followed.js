var React = require('react'),
	ReactRedux = require('react-redux'),
	_ = require('lodash'),
	api = require('./../steem/api'),
	Loading = require("./loading"),
	Link = require('react-router').Link;

var Followers = React.createClass({
	componentWillMount: function() {
		this.setState({users: []});
		api.getFollowing(this.props.username, 0, 'blog', 100, function(err, following) {
			this.setState({users: following});
		}.bind(this));
	},
	render: function(){
		return (
			<center className="users">
				{this.state.users.length > 0 && <ul>
					{this.state.users.map(function(user, key) {
						return <li key={key}>
							<div className="avatar avatar-xl">
								<img src={'https://img.busy6.com/@' + user.following} />
							</div>
							<div><Link to={'/@' + user.following}>@{user.following}</Link></div>
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