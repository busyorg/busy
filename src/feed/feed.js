var React = require('react'),
  _ = require('lodash'),
  Loading = require('./../widgets/Loading'),
  AddPost = require('./../post/newPost/EmbeddedNewPost'),
  PostFeedItem = require('../post/PostFeedItem');

import { connect } from 'react-redux';
import { getFeedContent, getMoreFeedContent } from './feedActions';
import { getFeedContentFromState, getFeedLoadingFromState } from './../helpers/stateHelpers';
import { RestoreScroll } from 'react-router-restore-scroll';

@connect(
  state => ({
    feed: state.feed,
    posts: state.posts,
  }),
  (dispatch, props) => ({
    getFeedContent: (sortBy, category, limit) => dispatch(
      getFeedContent({
        sortBy,
        category,
        limit,
      })
    ),
    getMoreFeedContent: (sortBy, category, limit) => dispatch(
      getMoreFeedContent({
        sortBy,
        category,
        limit,
      })
    ),
  })
)
export default class Feed extends React.Component {
  constructor(props) {
    super(props);
    this._customListener = [];
  }

  componentDidMount() {
    const { sortBy, category, limit, getFeedContent } = this.props;
    this.addScrollListener(this.refs.feedContainer);
    getFeedContent(sortBy, category, limit);
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
    const { sortBy, category, limit, getMoreFeedContent } = this.props;
    getMoreFeedContent(sortBy, category, limit);
  }

  scrollListener = (event) => {
    var el = event.target;
    let {scrollTop, scrollHeight, offsetHeight} = el;
    let scrollRemain = scrollHeight - scrollTop - offsetHeight;
    let scrollThreshold = window.innerHeight;
    if (scrollHeight && (scrollRemain < scrollThreshold)) {
      this.loadMore();
    }
  }

  render() {
    const { sortBy, category, feed, posts } = this.props;
    const content = getFeedContentFromState(sortBy, category, feed, posts);
    const isLoading = getFeedLoadingFromState(sortBy, category, feed);

    return (
      <RestoreScroll scrollKey="one">
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
      </RestoreScroll>
    );
  }
}
