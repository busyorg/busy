import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './../app/Header';
import Feed from './../feed/Feed';
import {
  getFeedContentFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState
} from './../helpers/stateHelpers';
import {
  getFeedContent,
  getMoreFeedContent,
} from './../feed/feedActions';

@connect(
  state => ({
    feed: state.feed,
    posts: state.posts,
  }),
  (dispatch, { sortBy, category, limit }) => {
    return {
      getFeedContent: () => dispatch(
        getFeedContent({ sortBy, category, limit })
      ),
      getMoreFeedContent: () => dispatch(
        getMoreFeedContent({ sortBy, category, limit })
      ),
    };
  }
)
export default class Bookmarks extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { sortBy, category, feed, posts, notify } = this.props;

    const content = getFeedContentFromState(sortBy, category, feed, posts);
    const isFetching = getFeedLoadingFromState(sortBy, category, feed);
    const hasMore = getFeedHasMoreFromState(sortBy, category, feed);
    const loadContentAction = this.props.getFeedContent;
    const loadMoreContentAction = this.props.getMoreFeedContent;

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
  limit: 10,
};
