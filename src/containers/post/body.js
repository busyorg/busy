var React = require('react'),
	_ = require('lodash'),
	steemembed = require('steemembed'),
	validator = require('validator'),
	striptags = require('striptags'),
	marked = require('marked');

module.exports = React.createClass({
	render: function(){
		var embeds = [];
		if (_.has(this.props.jsonMetadata, 'links')) {
			this.props.jsonMetadata.links.forEach(function (link) {
				var embed = steemembed.get(link);
				if (embed) embeds.push(embed);
			});
		}
		var regexp = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;
		var matches = regexp.exec(this.props.body);
		console.log(matches);
		matches.forEach(function(match) {
			if (validator.isURL(String(match))) {
				var embed = steemembed.get(match);
				if (embed) embeds.push(embed);
			}
		});
		console.log(embeds);
		var body = striptags(marked(this.props.body), ['a', 'p', 'h1', 'h2', 'h3', 'img']);
		return (
			<div>
				{_.has(embeds, '[0].embed') &&
				<div className="thumbs">
					<div dangerouslySetInnerHTML={{__html: embeds[0].embed}} />
				</div>}
				<span dangerouslySetInnerHTML={{__html: body}} />
			</div>);
	}
});