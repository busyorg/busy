var React = require('react'),
	striptags = require('striptags'),
	marked = require('marked'),
	ellipsis = require('text-ellipsis');

module.exports = React.createClass({
	getInitialState: function(){
		return {seeMore: false};
	},
	seeMore: function(){
		this.setState({seeMore: true});
	},
	render: function(){
		var body = striptags(marked(this.props.body));
		body = body.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
		var textLength = body.length;
		return (this.state.seeMore?
			<span dangerouslySetInnerHTML={{__html: striptags(marked(this.props.body), ['a', 'b', 'p'])}} /> :
			<span>
				<span dangerouslySetInnerHTML={{__html: ellipsis(body, 255, {ellipsis: '…'})}} />
				{textLength > 255 &&<span> <a href="#" onClick={() => this.seeMore()}>See More</a></span>}
			</span>
		);
	}
});