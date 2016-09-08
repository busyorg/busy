var React = require('react'),
  _ = require('lodash'),
  api = require('./../../steem/api'),
  Loading = require('./../loading'),
  AddPost = require('./../add-post'),
  Post = require('./../post/post');

module.exports = class componentName extends React.Component {
  constructor(props) {
    super(props);
    this.state = { content: [], isLoading: true };
    this._customListener = [];
  }
  componentWillMount() {
    this.getDiscussions();
  }

  getDiscussions = (tag, limit, start_author, start_permlink) => {
    limit = limit || 20;
    let type = {
      "feed": 'getDiscussionsByFeed',
      'trending': 'getDiscussionsByTrending',
      'hot': 'getDiscussionsByHot',
      'cashout': 'getDiscussionsByCashout',
      'created': 'getDiscussionsByCreated',
      'active': 'getDiscussionsByActive'
    }
    let currentType = type[this.props.path] || type['trending'];

    let feed = this.props.path.match(/(@)(\w+)(\/feed)/);
    if (feed && feed.length && feed[2]) {
      currentType = type['feed'];
      tag = feed[2] //username
    }

    api[currentType]({ tag, limit, start_author, start_permlink }, (err, result) => {
      err && console.error('error while ' + currentType, JSON.stringify(err));
      let lastContent = _.last(this.state.content);
      let lastResult = _.last(result);
      let content;
      if (lastResult && lastContent && lastResult.id == lastContent.id) {
        content = this.state.content;
      } else {
        content = _.concat(this.state.content, result);
      }
      this.setState({ content, isLoading: false });
    });
  }

  componentDidMount() {
    this.addScrollListener(this.refs.feedContainer);
  }

  addScrollListener(domNode) {
    this.addCustomListener('scroll', domNode, this.scrollListener);
    this.addCustomListener('resize', domNode, this.scrollListener);
  }

  addCustomListener(listenerType, target, listener) {
    if (target) {
      this._customListener.push({ listenerType, target, listener });
      target.addEventListener(listenerType, listener);
    }
  }

  componentWillUnmount() {
    _.each(this._customListener, ({listenerType, target, listener}) => {
      target.removeEventListener(listenerType, listener);
    })
  }

  loadMore = () => {
    let content = this.state.content;
    if (content && content.length) {
      let lastContent = content[content.length - 1];
      this.getDiscussions("", 10, lastContent.author, lastContent.permlink);
    }
  }

  scrollListener = (event) => {
    var el = event.target;
    let {scrollTop, scrollHeight, offsetHeight} = el;
    let scrollRemain = scrollHeight - scrollTop - offsetHeight;
    let scrollThreshold = window.innerHeight * 4;
    if (scrollHeight && (scrollRemain < scrollThreshold) && !this.state.isLoading) {
      this.setState({ isLoading: true }, () => {
        this.loadMore();
      });
    }
  }

  render() {
    let {content, isLoading} = this.state;
    return (
      <div className="grid">
        <div className="grid-content" ref="feedContainer">
          <AddPost />
          {content.map(function (entry, key) {
            return <Post key={key} entry={entry} replies={this.props.replies} />;
          }.bind(this)) }
          {isLoading && <Loading />}
        </div>
      </div>
    );
  }
}