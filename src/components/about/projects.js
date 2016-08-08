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
					<div className="block">
						<h1>Steem.js <img src="/img/open-source.svg" height="46" /></h1>
						<a href="https://steemjs.com/">https://steemjs.com/</a>
						<a href="https://www.npmjs.com/package/steem">https://www.npmjs.com/package/steem</a>
					</div>
					<div className="block">
						<h1>Steem API <img src="/img/open-source.svg" height="46" /></h1>
						<a href="https://github.com/adcpm/steem-api">https://github.com/adcpm/steem-api</a>
					</div>
					<div className="block">
						<h1>Steem Connect <img src="/img/open-source.svg" height="46" /></h1>
						<a href="https://steemconnect.com/">https://steemconnect.com/</a>
					</div>
					<div className="block">
						<h1>Steem Embed <img src="/img/open-source.svg" height="46" /></h1>
						<a href="https://www.npmjs.com/package/steemembed">https://www.npmjs.com/package/steemembed</a>
					</div>
				</div>
			</div>
		);
	}
});