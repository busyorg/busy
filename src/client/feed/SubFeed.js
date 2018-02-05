import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Cookie from 'js-cookie';
import _ from 'lodash';
import { getFeedContent, getMoreFeedContent } from './feedActions';
import {
  getFeedContentFromState,
  getFeedLoadingFromState,
  getFeedFetchedFromState,
  getUserFeedContentFromState,
  getUserFeedLoadingFromState,
  getUserFeedFetchedFromState,
  getFeedHasMoreFromState,
} from '../helpers/stateHelpers';
import {
  getIsAuthenticated,
  getIsLoaded,
  getAuthenticatedUser,
  getFeed,
  getPosts,
} from '../reducers';
import Feed from './Feed';
import EmptyFeed from '../statics/EmptyFeed';
import ScrollToTop from '../components/Utils/ScrollToTop';

@withRouter
@connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    loaded: getIsLoaded(state),
    user: getAuthenticatedUser(state),
    feed: getFeed(state),
    posts: getPosts(state),
  }),
  dispatch => ({
    getFeedContent: (sortBy, category) => dispatch(getFeedContent({ sortBy, category, limit: 10 })),
    getMoreFeedContent: (sortBy, category) =>
      dispatch(getMoreFeedContent({ sortBy, category, limit: 10 })),
  }),
)
class SubFeed extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    loaded: PropTypes.bool.isRequired,
    user: PropTypes.shape().isRequired,
    feed: PropTypes.shape().isRequired,
    posts: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    getFeedContent: PropTypes.func,
    getMoreFeedContent: PropTypes.func,
  };

  static defaultProps = {
    getFeedContent: () => {},
    getMoreFeedContent: () => {},
  };

  componentDidMount() {
    const { authenticated, loaded, user, match, feed, posts } = this.props;
    const category = match.params.category;
    let content = [];

    if (!loaded && Cookie.get('access_token')) return;

    if (match.url === '/' && authenticated) {
      content = getUserFeedContentFromState(user.name, feed, posts);
      if (_.isEmpty(content)) {
        this.props.getFeedContent('feed', user.name);
      }
    } else {
      const sortBy = match.params.sortBy || 'trending';
      content = getFeedContentFromState(sortBy, match.params.category, feed, posts);
      if (_.isEmpty(content)) {
        this.props.getFeedContent(sortBy, category);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { authenticated, loaded, user, match, feed } = nextProps;
    const oldSortBy = this.props.match.params.sortBy;
    const newSortBy = match.params.sortBy || 'trending';
    const oldCategory = this.props.match.params.category;
    const newCategory = match.params.category;
    const wasAuthenticated = this.props.authenticated;
    const isAuthenticated = authenticated;
    const wasLoaded = this.props.loaded;
    const isLoaded = loaded;

    if (!isLoaded && Cookie.get('access_token')) return;

    if (
      match.url === '/' &&
      ((match.url !== this.props.match.url && isAuthenticated) ||
        (isAuthenticated && !wasAuthenticated))
    ) {
      const fetching = getUserFeedLoadingFromState(user.name, feed);
      const fetched = getUserFeedFetchedFromState(user.name, feed);
      if (!fetching && !fetched) {
        this.props.getFeedContent('feed', user.name);
      }
    } else if (oldSortBy !== newSortBy || oldCategory !== newCategory || (!wasLoaded && isLoaded)) {
      const fetching = getFeedLoadingFromState(newSortBy, newCategory, feed);
      const fetched = getFeedFetchedFromState(newSortBy, newCategory, feed);
      if (!fetching && !fetched) {
        this.props.getFeedContent(newSortBy, newCategory);
      }
    }
  }

  render() {
    const { authenticated, loaded, user, feed, posts, match } = this.props;
    let content = [];
    let isFetching = false;
    let fetched = false;
    let hasMore = false;
    let loadMoreContent = () => {};

    if (authenticated && match.url === '/') {
      content = getUserFeedContentFromState(user.name, feed, posts);
      isFetching = getUserFeedLoadingFromState(user.name, feed);
      fetched = getUserFeedFetchedFromState(user.name, feed);
      hasMore = feed.created[user.name] ? feed.created[user.name].hasMore : true;
      loadMoreContent = () => this.props.getMoreFeedContent('feed', user.name);
    } else {
      const sortBy = match.params.sortBy || 'trending';
      content = getFeedContentFromState(sortBy, match.params.category, feed, posts);
      isFetching = getFeedLoadingFromState(sortBy, match.params.category, feed);
      fetched = getFeedFetchedFromState(sortBy, match.params.category, feed);
      hasMore = getFeedHasMoreFromState(sortBy, match.params.category, feed);
      loadMoreContent = () => this.props.getMoreFeedContent(sortBy, match.params.category);
    }

    const loadScrollToTop = _.isEmpty(content);

    return (
      <div>
        {loadScrollToTop && <ScrollToTop />}
        <Feed
          content={content}
          isFetching={isFetching}
          hasMore={hasMore}
          loadMoreContent={loadMoreContent}
        />
        {!content.length && fetched && loaded && <EmptyFeed />}
      </div>
    );
  }
}

export default SubFeed;
