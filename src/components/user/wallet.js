var React = require('react'),
	ReactRedux = require('react-redux'),
	_ = require('lodash'),
	api = require('./../../steem/api'),
	moment = require('moment'),
	actions = require('../../actions'),
	Triggers = require('./../../containers/triggers'),
	Header = require('./../../containers/header'),
	Link = require('react-router').Link;

var Wallet = React.createClass({
	componentWillMount: function() {
		this.props.setMenu('secondary');
		this.setState({account: {}});
		api.getAccounts([this.props.params.name], function(err, accounts) {
			this.setState({account: accounts[0]});
		}.bind(this));
	},
	componentWillReceiveProps: function(nextProps) {
		this.props.setMenu('secondary');
		this.setState({account: {}});
		api.getAccounts([this.props.params.name], function(err, accounts) {
			this.setState({account: accounts[0]});
		}.bind(this));
	},
	render: function(){
		var username = this.props.params.name;
		return (
			<div className="main-panel">
				<Triggers />
				<Header account={username} />
				<div><div style={{height: '20px', overflow: 'hidden'}}></div></div>
				<div className="container">
					<center>
						<h1>Wallet</h1>
					</center>
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

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(Wallet);