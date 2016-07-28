var React = require("react"),
	ReactRedux = require("react-redux"),
	actions = require("../actions");

var Account = React.createClass({
	render: function(){
		return (
			<div className="mod-main">
				<div className="mod-header"><h2>Account</h2></div>
				<div className="mod-content">
					<div className="text-xs-center">
						<img className="avatar mbm" src={this.props.auth.user.picture_large} width="100" height="100" />
						<h1 className="mbl">{this.props.auth.user.name}</h1>
						<h2><a href="#">Settings</a></h2>
						<h2><a href="#" onClick={() => this.props.showModal('addons')}>Addons</a></h2>
						<h2><a href="#" onClick={() => this.props.showModal('campaign')}>Create Campaign</a></h2>
						<h2><a href="#" onClick={() => this.props.showModal('traffic-source')}>Add Traffic Source</a></h2>
						<h2><a href="#" onClick={() => this.props.showModal('flow')}>Create Flow</a></h2>
						<h2><a href="#" onClick={() => this.props.showModal('lander')}>Add Lander</a></h2>
						<h2><a href="#" onClick={() => this.props.showModal('offer')}>Add Offer</a></h2>
						<h2><a href="#" onClick={() => this.props.showModal('affiliate-network')}>Add Affiliate Network</a></h2>
						<h2><a href="/logout">Logout</a></h2>
					</div>
				</div>
			</div>);
	}
});

var mapStateToProps = function(state){
	return {
		modal: state.modal,
		auth: state.auth
	};
};

var mapDispatchToProps = function(dispatch){
	return {
		showModal: function(page){ dispatch(actions.showModal(page)); },
		hideModal: function(){ dispatch(actions.hideModal()); }
	}
};

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(Account);