import React, { Component } from 'react';
import { connect } from 'react-redux';

import Header from '../app/Header';
import Feed from '../feed/Feed';
import {
  getFeedContentFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState
} from '../helpers/stateHelpers';
import * as bookmarksActions from './bookmarksActions';

@connect(
  state => ({
    feed: state.feed,
    posts: state.posts,
  }),
  dispatch => ({
    getBookmarks: () => dispatch(bookmarksActions.getBookmarks()),
  })
)
export default class Bookmarks extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getBookmarks();
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
        <div className="my-3">
          <h1 className="text-xs-center">Bookmarks</h1>
          <Feed
            content={content}
            isFetching={isFetching}
            hasMore={hasMore}
            loadContent={loadContentAction}
            loadMoreContent={loadMoreContentAction}
            notify={notify}
          />
          { !isFetching && !content.length &&
            <div className="container">
              <h3 className="text-xs-center">
                You don't have any story saved.
              </h3>
            </div>
          }
        </div>
      </div>
    );
  }
}
Bookmarks.defaultProps = {
  sortBy: 'bookmarks',
  category: 'all',
};
