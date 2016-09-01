var React = require('react');

module.exports = React.createClass({
	render: function(){
		return (
			<fieldset className="form-group">
				<textarea autoFocus type="text" className="form-control form-control-lg" ref="reply" />
			</fieldset>
		);
	}
});