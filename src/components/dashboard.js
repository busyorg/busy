var React = require("react"),
	ReactRedux = require('react-redux'),
	Page = require("./../containers/page");

var Dashboard = React.createClass({
	render: function(){
		var path = this.props.auth.isAuthenticated? '@' + this.props.auth.user.name + '/feed' : '/';
		return (
			this.props.auth.isAuthenticated? <Page path={path} key="feed" /> : <Page path={path} key="dashboard" />
		);
	}
});

var mapStateToProps = function(state){
	return {
		auth: state.auth
	};
};

module.exports = ReactRedux.connect(mapStateToProps)(Dashboard);