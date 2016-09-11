var React = require('react'),
	ReactRedux = require('react-redux'),
	actions = require('./../actions'),
	Header = require("./../app/header");

var Callback = React.createClass({
	componentWillMount: function(){
		var token = this.props.location.query.token;
		this.props.login(token);
	},
	render: function(){
		return (
			<div className="main-panel">
				<Header />
				<section className="align-center bg-green">
					<div className="pal">
						<i className="material-icons icon icon-xxl">play_arrow</i>
					</div>
				</section>
			</div>
		);
	}
});

var mapStateToProps = function(state){
	return {
		app: state.app,
		auth: state.auth,
		header: state.header
	};
};

var mapDispatchToProps = function(dispatch){
	return {
		login: function(token){ dispatch(actions.login(token)); }
	}
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Callback);
