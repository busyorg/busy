let React = require('react'),
  api = require('../steemAPI'),
  ReplyShort = require('./reply-short'),
  Loading = require('../widgets/Loading');

module.exports = React.createClass({
  componentWillMount() {
    this.setState({ replies: [] });
    api.getContentReplies(this.props.parent, this.props.parentPermlink, (err, replies) => {
      this.setState({ replies });
    });
  },
  render() {
    return (
      <div className="replies">
        {this.state.replies.length > 0 && <ul>
          {this.state.replies.slice(0, 3).map((reply, key) => {
            return <ReplyShort key={key} reply={reply} />;
          })}
        </ul>}
        {this.state.replies.length === 0 && <Loading />}
      </div>
    );
  }
});
