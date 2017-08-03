import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Feed from '../feed/Feed';
import {
  getFeedContentFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
} from '../helpers/stateHelpers';
import { getBookmarks } from './bookmarksActions';

@connect(
  state => ({
    feed: state.feed,
    posts: state.posts,
  }),
  dispatch => ({
    getBookmarks: () => dispatch(getBookmarks()),
  }),
)
export default class Bookmarks extends Component {
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
        <div className="my-5">
          <h1 className="text-center">
            <FormattedMessage id="bookmarks" defaultMessage="Bookmarks" />
          </h1>
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
              <h3 className="text-center">
                <FormattedMessage id="empty_bookmarks" defaultMessage="You don't have any story saved." />
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
