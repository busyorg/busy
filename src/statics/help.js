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
						<h1>Help</h1>
						<p><Link to="/trending/busy-help">#busy-help</Link></p>
						<p><Link to="/@busy">@busy</Link></p>
					</div>
				</div>
			</div>
		);
	}
});
