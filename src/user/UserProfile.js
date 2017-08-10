import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Feed from '../feed/Feed';
import {
  getFeedContentFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
} from '../helpers/stateHelpers';
import { getFeedContent, getMoreFeedContent } from '../feed/feedActions';
import EmptyUserProfile from '../statics/EmptyUserProfile';
import EmptyUserOwnProfile from '../statics/EmptyUserOwnProfile';

@connect(state => ({
  auth: state.auth,
  feed: state.feed,
  posts: state.posts,
}), {
  getFeedContent,
  getMoreFeedContent,
})
export default class UserProfile extends React.Component {
  static propTypes = {
    feed: PropTypes.shape().isRequired,
    posts: PropTypes.shape().isRequired,
    auth: PropTypes.shape().isRequired,
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
    const { feed, posts, limit, auth } = this.props;
    const username = this.props.match.params.name;
    const isOwnProfile = auth.isAuthenticated && username === auth.user.name;
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
