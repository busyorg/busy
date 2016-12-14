let React = require('react'),
  _ = require('lodash'),
  steemembed = require('steemembed'),
  striptags = require('striptags'),
  marked = require('marked');

module.exports = React.createClass({
  render() {
    const embeds = steemembed.getAll(this.props.body);
    let body = this.props.body;
    body = striptags(marked(body), ['a', 'p', 'h1', 'h2', 'h3', 'img', 'code', 'pre']);
    let jsonMetadata = {};
    try { jsonMetadata = JSON.parse(this.props.jsonMetadata); }
    catch (e) { }
    if (_.has(jsonMetadata, 'image[0]')) {
      jsonMetadata.image.forEach((image) => {
        const newUrl = 'https://img1.steemit.com/870x600/' + image;
        body = body.replace(new RegExp(image, 'g'), newUrl);
        body = body.replace(new RegExp('<a href="' + newUrl + '">' + newUrl + '</a>', 'g'),
          '<img src="' + newUrl + '">');
      });
    }
    return (
      <div>
        {_.has(embeds, '[0].embed') &&
        <div className="thumbs">
          <div dangerouslySetInnerHTML={{ __html: embeds[0].embed }} />
        </div>}
        <span dangerouslySetInnerHTML={{ __html: body }} />
      </div>);
  }
});
