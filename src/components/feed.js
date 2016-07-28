var React = require("react"),
	Page = require("./../containers/page");

module.exports = React.createClass({
	render: function(){
		var path = this.props.params.path;
		return (
			<Page 
				page={path}
				options={{path: '/' + path}}
				title=""
				icon="insert_link"
				add="post"
			/>
		);
	}
});