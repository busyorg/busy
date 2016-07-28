var React = require("react"),
	ReactRedux = require("react-redux"),
	actions = require("../actions");

var DateRange = React.createClass({
	setPeriod: function(period) {
		this.props.setPeriod(period);
		this.props.hideModal();
	},
	render: function(){
		return (
			<div className="mod-main">
				<div className="mod-header"><h2>Date Range</h2></div>
				<div className="mod-content">
					<p><a href="#" onClick={() => this.setPeriod('today')}>Today</a></p>
					<p><a href="#" onClick={() => this.setPeriod('yesterday')}>Yesterday</a></p>
					<p><a href="#" onClick={() => this.setPeriod('last-7-days')}>Last 7 Days</a></p>
					<p><a href="#" onClick={() => this.setPeriod('last-30-days')}>Last 30 Days</a></p>
					<p><a href="#" onClick={() => this.setPeriod('this-month')}>This Month</a></p>
					<p><a href="#" onClick={() => this.setPeriod('last-month')}>Last Month</a></p>
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
		setPeriod: function(period){ dispatch(actions.setPeriod(period)); },
		hideModal: function(){ dispatch(actions.hideModal()); }
	}
};

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(DateRange);