import React, { Component } from 'react';
import Feed from './../feed/Feed';
import {
  getFeedContentFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState
} from './../helpers/stateHelpers';

export default class UserFeed extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { feed, posts, getUserFeedContent, getMoreUserFeedContent } = this.props;
    const username = this.props.params.name;

    const content = getFeedContentFromState(username, feed, posts);
    const isFetching = getFeedLoadingFromState('comments', username, feed);
    const hasMore = getFeedHasMoreFromState('comments', username, feed);
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
      />
    );
  }
}
