import React, { Component } from 'react';
import Feed from '../feed/Feed';
import {
  getFeedContentFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState
} from '../helpers/stateHelpers';

export default class UserProfileFeed extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { feed, posts, getUserFeedContent, getMoreUserFeedContent } = this.props;
    const username = this.props.params.name;

    const content = getFeedContentFromState('feed', username, feed, posts);
    const isFetching = getFeedLoadingFromState('feed', username, feed);
    const hasMore = getFeedHasMoreFromState('feed', username, feed);
    const loadContentAction = () => getUserFeedContent({
      sortBy: 'feed',
      username,
      limit: this.props.limit,
    });
    const loadMoreContentAction = () => getMoreUserFeedContent({
      sortBy: 'feed',
      username,
      limit: this.props.limit,
    });

    return (
      <Feed
        content={content}
        isFetching={isFetching}
        hasMore={hasMore}
        loadContent={loadContentAction}
        loadMoreContent={loadMoreContentAction}
        route={this.props.route}
      />
    );
  }
}
