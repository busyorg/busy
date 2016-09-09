var React = require('react'),
	ReactRedux = require('react-redux'),
	Header = require('./../containers/header'),
	Link = require('react-router').Link;

var Edit = React.createClass({
	render: function(){
		return (
			<div className="main-panel">
				<Header account={this.props.auth.user.name} />
				<div><div style={{height: '20px', overflow: 'hidden'}}></div></div>
				<div className="page">
					<div className="block">
						<h1>Edit Profile</h1>
						<p><a href="https://steemconnect.com/logout" target="_blank">Log Out</a></p>
					</div>
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

module.exports = ReactRedux.connect(mapStateToProps)(Edit);
