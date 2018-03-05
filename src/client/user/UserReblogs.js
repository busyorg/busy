import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Feed from '../feed/Feed';

import { getIsAuthenticated, getAuthenticatedUser, getFeed } from '../reducers';

import {
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
  getFeedFromState,
} from '../helpers/stateHelpers';
import { getFeedContent, getMoreFeedContent } from '../feed/feedActions';
import EmptyUserProfile from '../statics/EmptyUserProfile';
import EmptyUserOwnProfile from '../statics/EmptyUserOwnProfile';

@connect(
  state => ({
    authenticated: getIsAuthenticated(state),
    authenticatedUser: getAuthenticatedUser(state),
    feed: getFeed(state),
  }),
  {
    getFeedContent,
    getMoreFeedContent,
  },
)
export default class UserReblogs extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    authenticatedUser: PropTypes.shape().isRequired,
    feed: PropTypes.shape().isRequired,
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

  componentDidMount() {
    this.props.getFeedContent({
      sortBy: 'blog',
      category: this.props.match.params.name,
      limit: this.props.limit,
    });
  }

  render() {
    const { authenticated, authenticatedUser, feed, limit } = this.props;
    const username = this.props.match.params.name;
    const isOwnProfile = authenticated && username === authenticatedUser.name;
    const content = getFeedFromState('blog', username, feed);
    const isFetching = getFeedLoadingFromState('blog', username, feed);
    const hasMore = getFeedHasMoreFromState('blog', username, feed);
    const loadMoreContentAction = () =>
      this.props.getMoreFeedContent({
        sortBy: 'blog',
        category: username,
        limit,
      });

    return (
      <div>
        <Feed
          content={content}
          isFetching={isFetching}
          hasMore={hasMore}
          loadMoreContent={loadMoreContentAction}
        />
        {content.length === 0 && !isFetching && isOwnProfile && <EmptyUserOwnProfile />}
        {content.length === 0 && !isFetching && !isOwnProfile && <EmptyUserProfile />}
      </div>
    );
  }
}
