var React = require('react'),
	franc = require('franc'),
	striptags = require('striptags'),
	marked = require('marked');

module.exports = React.createClass({
	render: function(){
		var language = franc(this.props.title + ' ' + striptags(marked(this.props.body)));
		var textLength = (this.props.title + ' ' + striptags(marked(this.props.body))).length;
		return (language != 'eng' && textLength > 255 &&
			<img className="flag" src={'/img/flag/' + language.substr(0, 2) + '.svg'} />
		);
	}
});