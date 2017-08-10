import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getFeedContent,
  getMoreFeedContent,
  getUserFeedContent,
  getMoreUserFeedContent,
} from './feedActions';
import {
  getFeedContentFromState,
  getFeedLoadingFromState,
  getUserFeedContentFromState,
  getUserFeedLoadingFromState,
  getFeedHasMoreFromState,
} from '../helpers/stateHelpers';
import Feed from './Feed';
import EmptyFeed from '../statics/EmptyFeed';
import ScrollToTop from '../components/Utils/ScrollToTop';

@connect(
  (state, ownProps) => ({
    ...ownProps,
    auth: state.auth,
    feed: state.feed,
    posts: state.posts,
  }),
  dispatch => ({
    getFeedContent: (sortBy, category) => dispatch(getFeedContent({ sortBy, category, limit: 10 })),
    getMoreFeedContent: (sortBy, category) =>
      dispatch(getMoreFeedContent({ sortBy, category, limit: 10 })),
    getUserFeedContent: username => dispatch(getUserFeedContent({ username, limit: 10 })),
    getMoreUserFeedContent: username => dispatch(getMoreUserFeedContent({ username, limit: 10 })),
  }),
)
class SubFeed extends React.Component {
  static propTypes = {
    auth: PropTypes.shape().isRequired,
    feed: PropTypes.shape().isRequired,
    posts: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    getFeedContent: PropTypes.func,
    getMoreFeedContent: PropTypes.func,
    getUserFeedContent: PropTypes.func,
    getMoreUserFeedContent: PropTypes.func,
  };

  static defaultProps = {
    getFeedContent: () => {},
    getMoreFeedContent: () => {},
    getUserFeedContent: () => {},
    getMoreUserFeedContent: () => {},
  };

  componentDidMount() {
    const { auth, match } = this.props;
    const sortBy = match.params.sortBy || 'trending';
    const category = match.params.category;

    if (!auth.loaded) return;

    if (match.url === '/' && auth.isAuthenticated) {
      this.props.getUserFeedContent(auth.user.name);
    } else {
      this.props.getFeedContent(sortBy, category);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { auth, match } = nextProps;
    const oldSortBy = this.props.match.params.sortBy;
    const newSortBy = match.params.sortBy;
    const oldCategory = this.props.match.params.category;
    const newCategory = match.params.category;
    const wasAuthenticated = this.props.auth && this.props.auth.isAuthenticated;
    const isAuthenticated = auth && auth.isAuthenticated;
    const wasLoaded = this.props.auth && this.props.auth.loaded;
    const isLoaded = nextProps.auth && nextProps.auth.loaded;

    if (!auth.loaded) return;

    if (
      match.url === '/' &&
      ((match.url !== this.props.match.url && isAuthenticated) ||
        (isAuthenticated && !wasAuthenticated))
    ) {
      this.props.getUserFeedContent(auth.user.name);
    } else if (oldSortBy !== newSortBy || oldCategory !== newCategory || (!wasLoaded && isLoaded)) {
      this.props.getFeedContent(newSortBy || 'trending', match.params.category);
    }
  }

  render() {
    const { auth, feed, posts, match } = this.props;

    let content = [];
    let isFetching = false;
    let hasMore = false;
    let loadMoreContent = () => {};

    if (auth && auth.isAuthenticated && match.url === '/') {
      content = getUserFeedContentFromState(auth.user.name, feed, posts);
      isFetching = getUserFeedLoadingFromState(auth.user.name, feed);
      hasMore = feed.created[auth.user.name] ? feed.created[auth.user.name].hasMore : true;
      loadMoreContent = () => this.props.getMoreUserFeedContent(auth.user.name);
    } else {
      const sortBy = match.params.sortBy || 'trending';
      content = getFeedContentFromState(sortBy, match.params.category, feed, posts);
      isFetching = getFeedLoadingFromState(sortBy, match.params.category, feed);
      hasMore = getFeedHasMoreFromState(sortBy, match.params.category, feed);
      loadMoreContent = () => this.props.getMoreFeedContent(sortBy, match.params.category);
    }

    return (
      <div>
        <ScrollToTop />
        <Feed
          content={content}
          isFetching={isFetching}
          hasMore={hasMore}
          loadMoreContent={loadMoreContent}
        />
        {!content.length && !isFetching && auth.loaded && <EmptyFeed />}
      </div>
    );
  }
}

export default SubFeed;
