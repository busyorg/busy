var React = require("react"),
	Header = require("./../containers/header");

module.exports = React.createClass({
	render: function(){
		return (
			<div className="main-panel">
				<Header />
				<section className="align-center bg-green">
					<div className="pal">
						<img src="/img/logo-white.svg" width="100" height="100" />
					</div>
				</section>
			</div>
		);
	}
});