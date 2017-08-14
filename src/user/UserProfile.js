import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Feed from '../feed/Feed';

import { getIsAuthenticated, getAuthenticatedUser } from '../reducers';

import {
  getFeedContentFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
} from '../helpers/stateHelpers';
import { getFeedContent, getMoreFeedContent } from '../feed/feedActions';
import EmptyUserProfile from '../statics/EmptyUserProfile';
import EmptyUserOwnProfile from '../statics/EmptyUserOwnProfile';

@connect(state => ({
  authenticated: getIsAuthenticated(state),
  authenticatedUser: getAuthenticatedUser(state),
  feed: state.feed,
  posts: state.posts,
}), {
  getFeedContent,
  getMoreFeedContent,
})
export default class UserProfile extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    authenticatedUser: PropTypes.shape().isRequired,
    feed: PropTypes.shape().isRequired,
    posts: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    limit: PropTypes.number,
    getFeedContent: PropTypes.func,
    getMoreFeedContent: PropTypes.func,
  };

  static defaultProps = {
    limit: 10,
    getFeedContent: () => {},
    getMoreFeedContent: () => {},
  };

  static needs = [
    ({ name }) => getFeedContent({ sortBy: 'blog', category: name, limit: 10 }),
  ]

  componentWillMount() {
    this.props.getFeedContent({
      sortBy: 'blog',
      category: this.props.match.params.name,
      limit: this.props.limit,
    });
  }

  render() {
    const { authenticated, authenticatedUser, feed, posts, limit } = this.props;
    const username = this.props.match.params.name;
    const isOwnProfile = authenticated && username === authenticatedUser.name;
    const content = getFeedContentFromState('blog', username, feed, posts);
    const isFetching = getFeedLoadingFromState('blog', username, feed);
    const hasMore = getFeedHasMoreFromState('blog', username, feed);
    const loadMoreContentAction = () => this.props.getMoreFeedContent({
      sortBy: 'blog',
      category: username,
      limit,
    });

    return (
      <div>
        <div className="profile">
          <Feed
            content={content}
            isFetching={isFetching}
            hasMore={hasMore}
            loadMoreContent={loadMoreContentAction}
          />

          {content.length === 0 && !isFetching && isOwnProfile && <EmptyUserOwnProfile />}

          {content.length === 0 && !isFetching && !isOwnProfile && <EmptyUserProfile />}
        </div>
      </div>
    );
  }
}
