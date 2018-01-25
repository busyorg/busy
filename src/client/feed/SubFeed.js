import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Cookie from 'js-cookie';
import {
  getFeedContent,
  getMoreFeedContent,
  getUserFeedContent,
  getMoreUserFeedContent,
} from './feedActions';
import { showPostModal, hidePostModal } from '../app/appActions';
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
  getShowPostModal,
  getCurrentShownPostID,
} from '../reducers';
import Feed from './Feed';
import EmptyFeed from '../statics/EmptyFeed';
import ScrollToTop from '../components/Utils/ScrollToTop';
import PostModal from '../post/PostModal';

@withRouter
@connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    loaded: getIsLoaded(state),
    user: getAuthenticatedUser(state),
    feed: getFeed(state),
    posts: getPosts(state),
    showPostModalState: getShowPostModal(state),
    currentShownPostID: getCurrentShownPostID(state),
  }),
  dispatch => ({
    getFeedContent: (sortBy, category) => dispatch(getFeedContent({ sortBy, category, limit: 10 })),
    getMoreFeedContent: (sortBy, category) =>
      dispatch(getMoreFeedContent({ sortBy, category, limit: 10 })),
    getUserFeedContent: username => dispatch(getUserFeedContent({ username, limit: 10 })),
    getMoreUserFeedContent: username => dispatch(getMoreUserFeedContent({ username, limit: 10 })),
    showPostModal: postID => dispatch(showPostModal(postID)),
    hidePostModal: postID => dispatch(hidePostModal(postID)),
  }),
)
class SubFeed extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    loaded: PropTypes.bool.isRequired,
    showPostModalState: PropTypes.bool.isRequired,
    user: PropTypes.shape().isRequired,
    feed: PropTypes.shape().isRequired,
    posts: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    showPostModal: PropTypes.func.isRequired,
    hidePostModal: PropTypes.func.isRequired,
    currentShownPostID: PropTypes.number.isRequired,
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
    const { authenticated, loaded, user, match } = this.props;
    const sortBy = match.params.sortBy || 'trending';
    const category = match.params.category;

    if (!loaded && Cookie.get('access_token')) return;

    if (match.url === '/' && authenticated) {
      this.props.getUserFeedContent(user.name);
    } else {
      this.props.getFeedContent(sortBy, category);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { authenticated, loaded, user, match } = nextProps;
    const oldSortBy = this.props.match.params.sortBy;
    const newSortBy = match.params.sortBy;
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
      this.props.getUserFeedContent(user.name);
    } else if (oldSortBy !== newSortBy || oldCategory !== newCategory || (!wasLoaded && isLoaded)) {
      this.props.getFeedContent(newSortBy || 'trending', match.params.category);
    }
  }

  render() {
    const {
      authenticated,
      loaded,
      user,
      feed,
      posts,
      match,
      showPostModalState,
      currentShownPostID,
    } = this.props;

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
      loadMoreContent = () => this.props.getMoreUserFeedContent(user.name);
    } else {
      const sortBy = match.params.sortBy || 'trending';
      content = getFeedContentFromState(sortBy, match.params.category, feed, posts);
      isFetching = getFeedLoadingFromState(sortBy, match.params.category, feed);
      fetched = getFeedFetchedFromState(sortBy, match.params.category, feed);
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
          showPostModal={this.props.showPostModal}
        />
        {!content.length && fetched && loaded && <EmptyFeed />}
        <PostModal
          currentFeed={content}
          visible={showPostModalState}
          currentShownPostID={currentShownPostID}
          showPostModal={this.props.showPostModal}
          hidePostModal={this.props.hidePostModal}
          loadMoreFeedContent={loadMoreContent}
        />
      </div>
    );
  }
}

export default SubFeed;
