import React, { PropTypes } from 'react';
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
export default class Bookmarks extends React.Component {
  static propTypes = {
    feed: PropTypes.shape().isRequired,
    posts: PropTypes.shape().isRequired,
    getBookmarks: PropTypes.func,
  };

  static defaultProps = {
    getBookmarks: () => {},
  };

  componentDidMount() {
    this.props.getBookmarks();
  }

  render() {
    const { feed, posts } = this.props;

    const content = getFeedContentFromState('bookmarks', 'all', feed, posts);
    const isFetching = getFeedLoadingFromState('bookmarks', 'all', feed);
    const hasMore = getFeedHasMoreFromState('bookmarks', 'all', feed);
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
          />
          {!isFetching &&
            !content.length &&
            <div className="container">
              <h3 className="text-center">
                <FormattedMessage
                  id="empty_bookmarks"
                  defaultMessage="You don't have any story saved."
                />
              </h3>
            </div>}
        </div>
      </div>
    );
  }
}
