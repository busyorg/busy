import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Loading from '../components/Icon/Loading';
import { getFeed, getPosts, getPendingBookmarks, getIsReloading } from '../reducers';
import Feed from '../feed/Feed';
import {
  getFeedContentFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
} from '../helpers/stateHelpers';
import { reload } from '../auth/authActions';
import { getBookmarks } from './bookmarksActions';

@connect(
  state => ({
    feed: getFeed(state),
    posts: getPosts(state),
    pendingBookmarks: getPendingBookmarks(state),
    reloading: getIsReloading(state),
  }), { getBookmarks, reload })
export default class Bookmarks extends React.Component {
  static propTypes = {
    reloading: PropTypes.bool,
    feed: PropTypes.shape().isRequired,
    posts: PropTypes.shape().isRequired,
    pendingBookmarks: PropTypes.arrayOf(PropTypes.number),
    getBookmarks: PropTypes.func,
    reload: PropTypes.func,
  };

  static defaultProps = {
    reloading: false,
    pendingBookmarks: [],
    getBookmarks: () => {},
    reload: () => {},
  };

  componentWillMount() {
    this.props.reload().then(() => this.props.getBookmarks());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pendingBookmarks.length < this.props.pendingBookmarks.length) {
      this.props.getBookmarks();
    }
  }

  render() {
    const { reloading, feed, posts } = this.props;

    const content = getFeedContentFromState('bookmarks', 'all', feed, posts);
    const isFetching = getFeedLoadingFromState('bookmarks', 'all', feed);
    const hasMore = getFeedHasMoreFromState('bookmarks', 'all', feed);
    const loadContentAction = () => null;
    const loadMoreContentAction = () => null;

    return (
      <div className="shifted">
        <div className="container">
          <h1 className="text-center">
            <FormattedMessage id="bookmarks" defaultMessage="Bookmarks" />
          </h1>
          {reloading && <Loading />}
          {!reloading && <Feed
            content={content}
            isFetching={isFetching}
            hasMore={hasMore}
            loadContent={loadContentAction}
            loadMoreContent={loadMoreContentAction}
          />}
          {!reloading && !isFetching &&
            !content.length &&
            <div className="container">
              <h3 className="text-center">
                <FormattedMessage id="bookmarks_empty" defaultMessage="You don't have any story saved." />
              </h3>
            </div>}
        </div>
      </div>
    );
  }
}
