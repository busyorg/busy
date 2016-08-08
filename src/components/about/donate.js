var React = require("react"),
	Header = require("./../../containers/header");

module.exports = React.createClass({
	getInitialState: function() {
		return {
			key: Math.random()
		};
	},
	render: function(){
		return (
			<div className="main-panel">
				<Header menu="about" />
				<div><div style={{height: '20px', overflow: 'hidden'}}></div></div>
				<div className="page">
					<div className="block"><h1>Donate</h1></div>
					<div className="block"><h1>Donors</h1></div>
				</div>
			</div>
		);
	}
});