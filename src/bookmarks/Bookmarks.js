import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../app/Header';
import MenuFeed from '../app/Menu/MenuFeed';
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
        <Header title="Bookmarks" />
        <Feed
          content={content}
          isFetching={isFetching}
          hasMore={hasMore}
          loadContent={loadContentAction}
          loadMoreContent={loadMoreContentAction}
          notify={notify}
        />

        { !content.length &&
          <b className="align-center">
            You have stored no items in your bookmark!
          </b>
        }

      </div>
    );
  }
}
Bookmarks.defaultProps = {
  sortBy: 'bookmarks',
  category: 'all',
};
