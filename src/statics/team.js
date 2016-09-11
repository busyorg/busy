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
						<h1>Team</h1>
						<p><Link to="/@fabien">@fabien</Link> CTO</p>
						<p><Link to="/@ekitcho">@ekitcho</Link> CHRO</p>
						<p><Link to="/@kaptainkrayola">@kaptainkrayola</Link> Developer</p>
						<p><Link to="/@heimindanger">@heimindanger</Link> Developer</p>
						<p><Link to="/@clains">@clains</Link> CEO</p>
						<p><Link to="/@spectral">@spectral</Link> CEO</p>
						<p><Link to="/@nil1511">@nil1511</Link> Developer</p>
						<p><Link to="/@picokernel">@picokernel</Link> Developer</p>
						<p><Link to="/@svk">@svk</Link> Developer</p>
						<p>You? <Link to="/@fabien">Contact us</Link></p>
					</div>
				</div>
			</div>
		);
	}
});
