import React, { PropTypes } from 'react';
import Feed from '../feed/Feed';
import {
  getFeedContentFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
} from '../helpers/stateHelpers';
import EmptyUserProfile from '../statics/EmptyUserProfile';
import EmptyUserOwnProfile from '../statics/EmptyUserOwnProfile';

export default class UserReblogs extends React.Component {
  static propTypes = {
    feed: PropTypes.shape(),
    posts: PropTypes.shape(),
    auth: PropTypes.shape(),
    match: PropTypes.shape(),
    limit: PropTypes.number,
    getFeedContent: PropTypes.func,
    getMoreFeedContent: PropTypes.func,
  };

  static defaultProps = {
    feed: {},
    posts: {},
    auth: {},
    match: {},
    limit: 10,
    getFeedContent: () => {},
    getMoreFeedContent: () => {},
  };

  render() {
    const { feed, posts, auth, limit, getFeedContent, getMoreFeedContent } = this.props;
    const username = this.props.match.params.name;
    const isOwnProfile = auth.isAuthenticated && username === auth.user.name;
    const content = getFeedContentFromState('blog', username, feed, posts);
    const isFetching = getFeedLoadingFromState('blog', username, feed);
    const hasMore = getFeedHasMoreFromState('blog', username, feed);
    const loadContentAction = () =>
      getFeedContent({
        sortBy: 'blog',
        category: username,
        limit,
      });
    const loadMoreContentAction = () =>
      getMoreFeedContent({
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
          loadContent={loadContentAction}
          loadMoreContent={loadMoreContentAction}
        />

        {content.length === 0 && !isFetching && isOwnProfile && <EmptyUserOwnProfile />}

        {content.length === 0 && !isFetching && !isOwnProfile && <EmptyUserProfile />}
      </div>
    );
  }
}
