var React = require("react"),
	Header = require("./../containers/header");

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
					<div className="block about-1"><h1>Including billions of people in the global economy</h1></div>
					<div className="block about-2"><h1>Protecting rights through immutable records</h1></div>
					<div className="block about-3"><h1>Creating a true sharing economy</h1></div>
					<div className="block about-4"><h1>Ending the remittance ripoff</h1></div>
					<div className="block about-5"><h1>Protect privacy</h1></div>
					<div className="block about-6"><h1>Ensuring compensation for the creators of value</h1></div>
				</div>
			</div>
		);
	}
});