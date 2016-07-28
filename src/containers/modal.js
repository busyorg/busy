var React = require("react"),
	ReactRedux = require("react-redux"),
	actions = require("../actions"),

	Account = require('../form/account'),
	Addons = require('../form/addons'),
	DateRange = require('../form/date-range'),

	Campaign = require('../form/campaign'),
	TrafficSource = require('../form/traffic-source'),
	Flow = require('../form/campaign'),
	Lander = require('../form/campaign'),
	Offer = require('../form/campaign'),
	AffiliateNetwork = require('../form/campaign');

var Modal = React.createClass({
	render: function(){
		return (
			<div>
				{this.props.modal.isVisible && <div className="mod">
					<a className="mod-close" href="#" onClick={() => this.props.hideModal()}></a>
					<div className="mod-body">
						{this.props.modal.page == 'account' && <Account />}
						{this.props.modal.page == 'addons' && <Addons />}
						{this.props.modal.page == 'date-range' && <DateRange />}
						{this.props.modal.page == 'campaign' && <Campaign />}
						{this.props.modal.page == 'traffic-source' && <TrafficSource />}
						{this.props.modal.page == 'flow' && <Flow />}
						{this.props.modal.page == 'lander' && <Lander />}
						{this.props.modal.page == 'offer' && <Offer />}
						{this.props.modal.page == 'affiliate-network' && <AffiliateNetwork />}
					</div>
				</div>}
			</div>
		);
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

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(Modal);