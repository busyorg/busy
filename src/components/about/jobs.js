var React = require('react'),
	Header = require('./../../containers/header'),
	Link = require('react-router').Link;

module.exports = React.createClass({
	render: function(){
		return (
			<div className="main-panel">
				<Header menu="about" />
				<div><div style={{height: '20px', overflow: 'hidden'}}></div></div>
				<div className="page">
					<div className="block">
						<h1>Jobs</h1>
						<p>Roadmap: <Link to="https://github.com/adcpm/busy#roadmap">https://github.com/adcpm/busy#roadmap</Link></p>
						<p><Link to="/trending/busy-jobs">#busy-jobs</Link></p>
						<br/><br/>
						<h1>Stack</h1>
						<ul>
							<li>Node.js</li>
							<li>Express.js</li>
							<li>React.js</li>
							<li>Redux</li>
							<li>Steem.js</li>
						</ul>
					</div>
				</div>
			</div>
		);
	}
});