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
						<h1>Donate</h1>
						<p><Link to="/@busy">@busy</Link></p>
						<br/><br/>
						<h1>Donors</h1>
						<p><Link to="/@cass">@cass</Link></p>
						<p><Link to="/@bhuz">@bhuz</Link><br/><Link to="/findandreward/@bhuz/find-and-reward-first-rewards-distribution">Find&Reward: First Rewards Distribution</Link></p>
					</div>
				</div>
			</div>
		);
	}
});