var React = require('react'),
	franc = require('franc'),
	striptags = require('striptags'),
	marked = require('marked'),
	languages = require('./../../../lib/languages'),
	Link = require('react-router').Link;

module.exports = React.createClass({
	render: function(){
		var language = franc(this.props.title + ' ' + striptags(marked(this.props.body)));
		var textLength = (this.props.title + ' ' + striptags(marked(this.props.body))).length;
		return (language != 'eng' && language != 'sco' && textLength > 255 &&
			<span><Link to={'/hot/' + languages.getCountryCode(language)}>
				<img className="flag" alt={language} src={'/img/flag/' + languages.getCountryCode(language) + '.svg'} /></Link> </span>
		);
	}
});