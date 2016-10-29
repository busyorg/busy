import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './../app/Header';
import Feed from './../feed/Feed';
import {
  getFeedContentFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState
} from './../helpers/stateHelpers';

@connect(
  state => ({
    feed: state.feed,
    posts: state.posts,
  })
)
export default class Bookmarks extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { sortBy, category, feed, posts, notify } = this.props;

    const content = getFeedContentFromState(sortBy, category, feed, posts);
    const isFetching = getFeedLoadingFromState(sortBy, category, feed);
    const hasMore = false;
    const loadContentAction = () => null;
    const loadMoreContentAction = () => null;

    return (
      <div className="main-panel">
        <Header />
        <Feed
          content={content}
          isFetching={isFetching}
          hasMore={hasMore}
          loadContent={loadContentAction}
          loadMoreContent={loadMoreContentAction}
          notify={notify}
        />
      </div>
    );
  }
}
Bookmarks.defaultProps = {
  sortBy: 'bookmarks',
  category: 'all',
};
