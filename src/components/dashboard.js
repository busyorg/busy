var React = require("react"),
	Header = require("./../containers/header"),
	Quickstart = require("./../containers/quickstart");

module.exports = React.createClass({
	render: function(){
		return (
			<div className="main-panel">
				<Header />
				<Quickstart title="Getting Started" icon="flight_takeoff" />
				<center>
					<h3>Welcome on board</h3>
					<h3>Still not introduce yourself?</h3>
					<h3>Stats</h3>
				</center>
			</div>
		);
	}
});