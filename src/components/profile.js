var React = require("react"),
	Header = require("./../containers/header");

module.exports = React.createClass({
	render: function(){
		return (
			<div className="main-panel">
				<Header />
				<section className="align-center bg-green">
					<div className="pal">
						<i className="material-icons icon icon-xxl">play_arrow</i>
					</div>
				</section>
			</div>
		);
	}
});