var React = require('react'),
  _ = require('lodash'),
  api = require('./../steemAPI'),
  Loading = require('./../widgets/Loading'),
  AddPost = require('./../post/newPost/EmbeddedNewPost'),
  PostFeedItem = require('../post/PostFeedItem');

module.exports = React.createClass({
  componentWillMount: function() {
    this.setState({content: {}});
    api.getState(this.props.path, function(err, result) {
      this.setState({content: result['content']});
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
              return <PostFeedItem key={key} entry={content[entry]} replies={this.props.replies} />;
            }.bind(this)) : <Loading />
          }
        </div>
      </div>
    );
  }
});
