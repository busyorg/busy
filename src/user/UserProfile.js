import React, { PropTypes } from 'react';
import _ from 'lodash';
import Feed from '../feed/Feed';
import {
  getFeedContentFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
} from '../helpers/stateHelpers';
import { getFeedContent as getFeedContentStatic } from '../feed/feedActions';
import Loading from '../components/Icon/Loading';
import EmptyUserProfile from '../statics/EmptyUserProfile';
import EmptyUserOwnProfile from '../statics/EmptyUserOwnProfile';

export default class UserProfile extends React.Component {
  static propTypes = {
    feed: PropTypes.shape(),
    posts: PropTypes.shape(),
    auth: PropTypes.shape(),
    user: PropTypes.shape(),
    match: PropTypes.shape(),
    limit: PropTypes.number,
    getFeedContent: PropTypes.func,
    getMoreFeedContent: PropTypes.func,
  };

  static defaultProps = {
    feed: {},
    posts: {},
    auth: {},
    user: {},
    match: {},
    limit: 10,
    getFeedContent: () => {},
    getMoreFeedContent: () => {},
  };

  static needs = [
    ({ name }) => getFeedContentStatic({ sortBy: 'blog', category: name, limit: 10 }),
  ]

  componentWillMount() {
    this.props.getFeedContent({
      sortBy: 'blog',
      category: this.props.match.params.name,
      limit: this.props.limit,
    });
  }

  render() {
    const { feed, posts, getMoreFeedContent, limit, auth } = this.props;
    const username = this.props.match.params.name;
    const isOwnProfile = auth.isAuthenticated && username === auth.user.name;
    const content = getFeedContentFromState('blog', username, feed, posts);
    const isFetching = getFeedLoadingFromState('blog', username, feed);
    const hasMore = getFeedHasMoreFromState('blog', username, feed);
    const loadMoreContentAction = () => getMoreFeedContent({
      sortBy: 'blog',
      category: username,
      limit,
    });
    const user = this.props.user;

    return (
      <div>
        <div className="profile">
          {!_.has(user, 'name') && <Loading />}
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
