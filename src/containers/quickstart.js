var React = require("react");

module.exports = React.createClass({
	render: function(){
		return (
			<section className="align-center">
				<div className="mal">
					<i className="material-icons icon icon-xl">{this.props.icon}</i>
					<h1 className="mbl">{this.props.title}</h1>
					<p className="mbl">No items have been added to this section.</p>
					<button type="button" className="btn btn-primary btn-lg">Start</button>
				</div>
			</section>
		);
	}
});