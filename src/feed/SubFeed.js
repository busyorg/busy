import React from 'react';
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
  })
)
class SubFeed extends React.Component {
  componentDidMount() {
    const { auth, match } = this.props;
    if (auth && auth.isAuthenticated && match.url === '/') {
      this.props.getUserFeedContent(auth.user.name);
    } else {
      const sortBy = match.params.sortBy || 'trending';
      this.props.getFeedContent(sortBy, match.params.category);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { auth, match } = nextProps;
    const oldSortBy = this.props.match.params.sortBy || 'trending';
    const newSortBy = match.params.sortBy || 'trending';
    const oldCategory = this.props.match.params.category;
    const newCategory = match.params.category;
    const wasAuthenticated = this.props.auth && this.props.auth.isAuthenticated;
    const isAuthenticated = auth && auth.isAuthenticated;

    if (oldSortBy !== newSortBy || oldCategory !== newCategory) {
      this.props.getFeedContent(newSortBy, match.params.category);
    } else if (isAuthenticated && !wasAuthenticated) {
      this.props.getUserFeedContent(auth.user.name);
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
        {!content.length && !isFetching && <EmptyFeed />}
      </div>
    );
  }
}

export default SubFeed;
