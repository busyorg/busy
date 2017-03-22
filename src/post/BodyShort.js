import React from 'react';
import ellipsis from 'text-ellipsis';
import striptags from 'striptags';
import Remarkable from 'remarkable';

const remarkable = new Remarkable({ html: true });

export default React.createClass({
  getInitialState() {
    return { seeMore: false };
  },
  seeMore() {
    this.setState({ seeMore: true });
  },
  render() {
    let body = striptags(remarkable.render(this.props.body));
    body = body.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
    const textLength = body.length;
    return (this.state.seeMore ?
      <span dangerouslySetInnerHTML={{ __html: striptags(remarkable.render(this.props.body), ['a', 'b', 'p']) }} /> :
      <span>
        <span dangerouslySetInnerHTML={{ __html: ellipsis(body, 140, { ellipsis: '…' }) }} />
        {/*
          textLength > 140 &&
            <span className="see-more">
              <a onClick={() => this.seeMore()}>See More</a>
            </span>
        */}
      </span>
    );
  }
});
