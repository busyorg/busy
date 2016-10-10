import React, { Component } from 'react';
import Feed from './../feed/Feed';
import {
  getFeedContentFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState
} from './../helpers/stateHelpers';

export default class Posts extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.getUserComments(this.props.params.name);
  }

  render() {
    const { feed, posts, getUserComments, getMoreUserComments, limit } = this.props;
    const username = this.props.params.name;

    const content = getFeedContentFromState('comments', username, feed, posts);
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
