import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Cookie from 'js-cookie';
import _ from 'lodash';
import { showPostModal } from '../app/appActions';
import { getFeedContent, getMoreFeedContent } from './feedActions';

import {
  getFeedFromState,
  getFeedLoadingFromState,
  getFeedFetchedFromState,
  getUserFeedLoadingFromState,
  getUserFeedFetchedFromState,
  getFeedHasMoreFromState,
  getUserFeedFromState,
} from '../helpers/stateHelpers';
import { getIsAuthenticated, getIsLoaded, getAuthenticatedUser, getFeed } from '../reducers';
import Feed from './Feed';
import EmptyFeed from '../statics/EmptyFeed';
import LetsGetStarted from './LetsGetStarted';
import ScrollToTop from '../components/Utils/ScrollToTop';
import PostModal from '../post/PostModalContainer';

@withRouter
@connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    loaded: getIsLoaded(state),
    user: getAuthenticatedUser(state),
    feed: getFeed(state),
  }),
  dispatch => ({
    getFeedContent: (sortBy, category) => dispatch(getFeedContent({ sortBy, category, limit: 10 })),
    getMoreFeedContent: (sortBy, category) =>
      dispatch(getMoreFeedContent({ sortBy, category, limit: 10 })),
    showPostModal: post => dispatch(showPostModal(post)),
  }),
)
class SubFeed extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    loaded: PropTypes.bool.isRequired,
    user: PropTypes.shape().isRequired,
    feed: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    showPostModal: PropTypes.func.isRequired,
    getFeedContent: PropTypes.func,
    getMoreFeedContent: PropTypes.func,
  };

  static defaultProps = {
    getFeedContent: () => {},
    getMoreFeedContent: () => {},
  };

  componentDidMount() {
    const { authenticated, loaded, user, match, feed } = this.props;
    const category = match.params.category;
    let content = [];

    if (!loaded && Cookie.get('access_token')) return;

    if (match.url === '/' && authenticated) {
      content = getUserFeedFromState(user.name, feed);
      if (_.isEmpty(content)) {
        this.props.getFeedContent('feed', user.name);
      }
    } else {
      const sortBy = match.params.sortBy || 'trending';
      content = getFeedFromState(sortBy, match.params.category, feed);
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
    const { authenticated, loaded, user, feed, match } = this.props;
    let content = [];
    let isFetching = false;
    let fetched = false;
    let hasMore = false;
    let loadMoreContent = () => {};
    const isAuthHomeFeed = match.url === '/' && authenticated;

    if (isAuthHomeFeed) {
      content = getUserFeedFromState(user.name, feed);
      isFetching = getUserFeedLoadingFromState(user.name, feed);
      fetched = getUserFeedFetchedFromState(user.name, feed);
      hasMore = feed.created[user.name] ? feed.created[user.name].hasMore : true;
      loadMoreContent = () => this.props.getMoreFeedContent('feed', user.name);
    } else {
      const sortBy = match.params.sortBy || 'trending';
      content = getFeedFromState(sortBy, match.params.category, feed);
      isFetching = getFeedLoadingFromState(sortBy, match.params.category, feed);
      fetched = getFeedFetchedFromState(sortBy, match.params.category, feed);
      hasMore = getFeedHasMoreFromState(sortBy, match.params.category, feed);
      loadMoreContent = () => this.props.getMoreFeedContent(sortBy, match.params.category);
    }

    const empty = _.isEmpty(content);
    const displayEmptyFeed = empty && fetched && loaded && !isFetching;

    return (
      <div>
        {isAuthHomeFeed && <LetsGetStarted />}
        {empty && <ScrollToTop />}
        <Feed
          content={content}
          isFetching={isFetching}
          hasMore={hasMore}
          loadMoreContent={loadMoreContent}
          showPostModal={this.props.showPostModal}
        />
        <PostModal />
        {displayEmptyFeed && <EmptyFeed />}
      </div>
    );
  }
}

export default SubFeed;
