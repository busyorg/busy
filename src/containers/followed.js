var React = require('react'),
	ReactRedux = require('react-redux'),
	_ = require('lodash'),
	axios = require('axios'),
	Loading = require("./loading"),
	Link = require('react-router').Link;

var Followers = React.createClass({
	componentWillMount: function() {
		this.setState({users: []});
		this.getFollowing();
	},
	getFollowing: function() {
		axios.get('//api.steemjs.com/getFollowing?follower=' + this.props.username + '&startFollowing=0&followType=blog&limit=100')
			.then(response => {
				this.setState({users: response.data});
			});
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