var React = require("react"),
	Header = require("./../containers/header"),
	Quickstart = require("./../containers/quickstart");

module.exports = React.createClass({
	render: function(){
		return (
			<div className="main-panel">
				<Header />
				<Quickstart title="Stop Work. Get Busy." icon="show_chart" />
			</div>
		);
	}
});