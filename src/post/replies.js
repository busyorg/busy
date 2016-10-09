let React = require('react'),
  _ = require('lodash'),
  api = require('./../steemAPI'),
  Reply = require('./reply'),
  Loading = require('./../widgets/Loading');

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
          {_.sortBy(this.state.replies, 'created').reverse().map((reply, key) => {
            return <Reply key={key} reply={reply} />;
          })}
        </ul>}
        {this.state.replies.length === 0 && <Loading />}
      </div>
    );
  }
});
