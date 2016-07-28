var React = require("react"),
	ReactRedux = require("react-redux"),
	actions = require("../actions");

var Addons = React.createClass({
	render: function(){
		return (
			<div className="mod-main">
				<div className="mod-header"><h2>Add-ons</h2></div>
				<div className="mod-content">
					<h3>Tracking</h3>
					<div className="row">
						<div className="col col-lg-4 text-xs-center">
							<img src="//logo.clearbit.com/voluum.com?size=40" />
							<p>Voluum</p>
						</div>
					</div>
					<h3>Traffic Source</h3>
					<div className="row">
						<div className="col col-lg-4 text-xs-center">
							<img src="//logo.clearbit.com/exoclick.com?size=40" />
							<p>ExoClick</p>
						</div>
						<div className="col col-lg-4 text-xs-center">
							<img src="//logo.clearbit.com/facebook.com?size=40" />
							<p>Facebook Ads</p>
						</div>
					</div>
					<h3>Affiliate Network</h3>
					<div className="row">
						<div className="col col-lg-4 text-xs-center">
							<img src="//logo.clearbit.com/hasoffers.com?size=40" />
							<p>HasOffers</p>
						</div>
					</div>
				</div>
				<div className="mod-footer">
					<a href="#" onClick={() => this.props.hideModal()}>Close</a> <button type="submit" className="btn btn-primary btn-lg">Save</button>
				</div>
			</div>);
	}
});

var mapStateToProps = function(state){
	return {modal:state.modal};
};

var mapDispatchToProps = function(dispatch){
	return {
		hideModal: function(){ dispatch(actions.hideModal()); }
	}
};

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(Addons);