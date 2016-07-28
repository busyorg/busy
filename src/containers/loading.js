var React = require("react");

var Loading = React.createClass({
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

module.exports = Loading;