var React = require("react"),
	ReactRedux = require("react-redux"),
	actions = require("../actions"),
	Account = require('../form/account'),
	Campaign = require('../form/post');

var Modal = React.createClass({
	render: function(){
		return (
			<div>
				{this.props.modal.isVisible && <div className="mod">
					<a className="mod-close" href="#" onClick={() => this.props.hideModal()}></a>
					<div className="mod-body">
						{this.props.modal.page == 'account' && <Account />}
						{this.props.modal.page == 'campaign' && <Campaign />}
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