var React = require('react'),
	striptags = require('striptags'),
	marked = require('marked'),
	ellipsis = require('text-ellipsis');

module.exports = React.createClass({
	render: function(){
		var body = striptags(marked(this.props.body));
		body = body.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
		return (<span dangerouslySetInnerHTML={{__html: ellipsis(body, 255, {ellipsis: '…'})}} />);
	}
});