var React = require("react"),
	Page = require("./../containers/page");

module.exports = React.createClass({
	getInitialState: function() {
		return {
			key: Math.random()
		};
	},
	render: function(){
		var path = 'trending/' + this.props.params.tag;
		return (
			<Page key={Math.random()} path={path} />
		);
	}
});