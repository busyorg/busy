import React, { Component } from 'react';
import Feed from './../feed/Feed';
import {
  getUserCommentsFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState
} from './../helpers/stateHelpers';

export default class UserProfilePosts extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.setMenu('secondary');
  }

  render() {
    const { feed, comments, getUserComments, getMoreUserComments, limit } = this.props;
    const username = this.props.params.name;

    const content = getUserCommentsFromState(username, feed, comments);
    const isFetching = getFeedLoadingFromState('comments', username, feed);
    const hasMore = getFeedHasMoreFromState('comments', username, feed);
    const loadContentAction = () => getUserComments(username);
    const loadMoreContentAction = () => getMoreUserComments(username, limit);

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
