var React = require("react");

module.exports = React.createClass({
	render: function(){
		return (
			<div>
				<div style={{height: '10px', overflow: 'hidden'}}></div>
					<div className="loading align-center">
						<span>.</span>
						<span>.</span>
						<span>.</span>
					</div>
			</div>
		);
	}
});