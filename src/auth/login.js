var React = require('react'),
	ReactRedux = require('react-redux'),
	actions = require('./../actions'),
	Header = require("./../app/header"),
	Link = require('react-router').Link;

var Callback = React.createClass({
	componentWillMount: function(){
		var username = this.props.params.name;
		this.props.login(username);
	},
	render: function(){
		return (
			<div className="main-panel">
				<Header />
				<section className="align-center">
					<div className="pal">
						<Link to="/" className="btn btn-primary btn-lg">Start</Link>
					</div>
				</section>
			</div>
		);
	}
});

var mapStateToProps = function(state){
	return {};
};

var mapDispatchToProps = function(dispatch){
	return {
		login: function(username){ dispatch(actions.login(username)); }
	}
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Callback);
