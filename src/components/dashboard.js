var React = require("react"),
	Header = require("./../containers/header");

module.exports = React.createClass({
	render: function(){
		return (
			<div className="main-panel">
				<Header />
				<section className="align-center">
					<div className="mal">
						<i className="material-icons icon icon-xl">lightbulb_outline</i>
						<h1 className="mal">Welcome</h1>
						<p className="mbl">Still not introduced yourself? Click below and get started!</p>
						<div className="mam">
							<button type="button" className="btn btn-primary btn-lg">Introduce Myself</button>
						</div>
						<div className="mam">
							<a href="/trending">
								<button type="button" className="btn btn-secondary btn-lg">Explore</button>
							</a>
						</div>
					</div>
				</section>
			</div>
		);
	}
});