var React = require('react'),
  _ = require('lodash'),
  steem = require('./../../../lib/steem'),
  Loading = require('./../loading'),
  AddPost = require('./../add-post'),
  Post = require('./../post/post');

module.exports = React.createClass({
  componentWillMount: function() {
    this.setState({content: {}});
    steem.getState(this.props.path, 'content', function(err, content) {
      this.setState({content: content});
    }.bind(this));
  },
  render: function(){
    var content = this.state.content;
    content = (this.props.sortBy)? _.sortBy(content, this.props.sortBy).reverse() : content;
    content = (this.props.limit)? content.slice(0, this.props.limit) : content;
    return (
      <div className="grid">
        <div className="grid-content">
          <AddPost />
          {_.size(content) > 0?
            Object.keys(content).map(function(entry, key) {
              return <Post key={key} entry={content[entry]} replies={this.props.replies} />;
            }.bind(this)) : <Loading />
          }
        </div>
      </div>
    );
  }
});
