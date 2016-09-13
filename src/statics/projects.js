var React = require('react'),
	Header = require('./../app/header'),
	Link = require('react-router').Link;

module.exports = React.createClass({
	render: function(){
		return (
			<div className="main-panel">
				<Header menu="about" />
				<div><div style={{height: '20px', overflow: 'hidden'}}></div></div>
				<div className="page">
					<div className="block">
						<h1>Busy <img src="/img/open-source.svg" height="46" /></h1>
						<p><Link to="/trending/steemjs">#busy</Link></p>
						<p><a href="https://bus.yt/" target="_blank">https://bus.yt/</a><br/>
							<a href="https://github.com/adcpm/busy" target="_blank">https://github.com/adcpm/busy</a></p>
					</div>
					<div className="block">
						<h1>Steem.js <img src="/img/open-source.svg" height="46" /></h1>
						<p><Link to="/trending/steemjs">#steemjs</Link></p>
						<p><a href="https://steemjs.com/" target="_blank">https://steemjs.com/</a><br/>
						<a href="https://www.npmjs.com/package/steem" target="_blank">https://www.npmjs.com/package/steem</a></p>
					</div>
					<div className="block">
						<h1>Steem API <img src="/img/open-source.svg" height="46" /></h1>
						<p><Link to="/trending/steemapi">#steemapi</Link></p>
						<p><a href="https://github.com/adcpm/steem-api" target="_blank">https://github.com/adcpm/steem-api</a></p>
					</div>
					<div className="block">
						<h1>Steem Connect <img src="/img/open-source.svg" height="46" /></h1>
						<p><Link to="/trending/steemconnect">#steemconnect</Link></p>
						<p><a href="https://steemconnect.com/" target="_blank">https://steemconnect.com/</a></p>
					</div>
					<div className="block">
						<h1>Steem Script <img src="/img/open-source.svg" height="46" /></h1>
						<p>An Open JSON Standard for Trusted Workflows</p>
						<p><Link to="/trending/steemscript">#steemscript</Link></p>
						<p><a href="https://github.com/adcpm/steemscript" target="_blank">https://github.com/adcpm/steemscript</a></p>
					</div>
					<div className="block">
						<h1>Steem Embed <img src="/img/open-source.svg" height="46" /></h1>
						<p><Link to="/trending/steemembed">#steemembed</Link></p>
					  <p><a href="https://www.npmjs.com/package/steemembed" target="_blank">https://www.npmjs.com/package/steemembed</a></p>
					</div>
					<div className="block">
						<h1>Busy Img <img src="/img/open-source.svg" height="46" /></h1>
						<p><a href="https://www.npmjs.com/package/steemembed" target="_blank">https://img.busy6.com/</a></p>
					</div>
					<div className="block">
						<h1>Busy WebSocket <img src="/img/open-source.svg" height="46" /></h1>
						<p><a href="https://www.npmjs.com/package/steemembed" target="_blank">https://ws.busy6.com/</a></p>
					</div>
					<div className="block">
						<h1>Busy DB <img src="/img/open-source.svg" height="46" /></h1>
					</div>
				</div>
			</div>
		);
	}
});
