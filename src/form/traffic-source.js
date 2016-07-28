var React = require("react"),
	ReactRedux = require("react-redux"),
	validator = require('validator'),
	actions = require("../actions");

var TrafficSource = React.createClass({
	save: function(){
		var data = {
			name: this.refs.name.value,
			postback_url: this.refs.postback_url.value
		};
		this.props.saveEntry('traffic-sources', data);
	},
	render: function(){
		return (
			<div className="mod-main">
				<div className="mod-header"><h2>Add Traffic Source</h2></div>
				<div className="mod-content">
					<fieldset className="form-group">
						<label for="formGroupExampleInput">Name</label>
						<input autoFocus type="text" className="form-control form-control-lg" ref="name" />
					</fieldset>
					<fieldset className="form-group">
						<label for="formGroupExampleInput">Postback URL</label>
						<input type="text" className="form-control form-control-lg" ref="postback_url" />
					</fieldset>
				</div>
				<div className="mod-footer">
					<a href="#" onClick={() => this.props.hideModal()}>Close</a> <button disabled={this.props.modal.isFetching} type="submit" onClick={() => this.save()} className="btn btn-primary btn-lg">Save</button>
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
		hideModal: function(){ dispatch(actions.hideModal()); },
		saveEntry: function(key, data){ dispatch(actions.saveEntry(key, data)); }
	}
};

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(TrafficSource);