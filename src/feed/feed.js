var React = require('react'),
  _ = require('lodash'),
  Loading = require('./../widgets/Loading'),
  AddPost = require('./../post/newPost/EmbeddedNewPost'),
  PostFeedItem = require('../post/PostFeedItem');

import { RestoreScroll } from 'react-router-restore-scroll';

export default class Feed extends React.Component {
  constructor(props) {
    super(props);
    this._customListener = [];
  }

  componentDidMount() {
    this.addScrollListener(this.refs.feedContainer);
    this.props.loadContent();
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

  scrollListener = (event) => {
    console.log(event);
    var el = event.target;
    let {scrollTop, scrollHeight, offsetHeight} = el;
    let scrollRemain = scrollHeight - scrollTop - offsetHeight;
    let scrollThreshold = window.innerHeight;
    if (scrollHeight && (scrollRemain < scrollThreshold)) {
      this.props.loadMoreContent();
    }
  };

  render() {
    const { content, isLoading } = this.props;

    return (
        <div className="grid" ref="feedContainer">
          <div className="grid-content" >
            <AddPost />
            {
              content.map((entry, key) =>
                <PostFeedItem key={key} entry={entry} replies={this.props.replies} />
              )
            }
            {isLoading && <Loading />}
          </div>
        </div>
    );
  }
}
