var React = require("react"),
	Page = require("./../../containers/page");

module.exports = React.createClass({
	render: function(){
		var account = this.props.params.name;
		return (
			<Page account={account} path={'@' + account + '/posts'} />
		);
	}
});