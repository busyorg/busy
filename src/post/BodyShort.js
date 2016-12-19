let React = require('react'),
  striptags = require('striptags'),
  marked = require('marked'),
  ellipsis = require('text-ellipsis');

module.exports = React.createClass({
  getInitialState() {
    return { seeMore: false };
  },
  seeMore() {
    this.setState({ seeMore: true });
  },
  render() {
    let body = striptags(marked(this.props.body));
    body = body.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
    const textLength = body.length;
    return (this.state.seeMore ?
      <span dangerouslySetInnerHTML={{ __html: striptags(marked(this.props.body), ['a', 'b', 'p']) }} /> :
      <span>
        <span dangerouslySetInnerHTML={{ __html: ellipsis(body, 255, { ellipsis: '…' }) }} />
        {textLength > 255 && <span className="see-more"> <a onClick={() => this.seeMore()}>See More</a></span>}
      </span>
    );
  }
});
