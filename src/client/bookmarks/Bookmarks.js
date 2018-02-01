import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import _ from 'lodash';
import {
  getFeed,
  getPosts,
  getPendingBookmarks,
  getIsReloading,
  getBookmarks as getBookmarksState,
} from '../reducers';
import Feed from '../feed/Feed';
import {
  getFeedContentFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
} from '../helpers/stateHelpers';
import { reload } from '../auth/authActions';
import { getBookmarks } from '../feed/feedActions';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import requiresLogin from '../auth/requiresLogin';

@requiresLogin
@injectIntl
@connect(
  state => ({
    feed: getFeed(state),
    posts: getPosts(state),
    pendingBookmarks: getPendingBookmarks(state),
    reloading: getIsReloading(state),
    bookmarks: getBookmarksState(state),
  }),
  { getBookmarks, reload },
)
export default class Bookmarks extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    reloading: PropTypes.bool,
    feed: PropTypes.shape().isRequired,
    posts: PropTypes.shape().isRequired,
    pendingBookmarks: PropTypes.arrayOf(PropTypes.number),
    getBookmarks: PropTypes.func,
    reload: PropTypes.func,
    bookmarks: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    reloading: false,
    pendingBookmarks: [],
    getBookmarks: () => {},
    reload: () => {},
  };

  componentDidMount() {
    this.props.reload().then(() => this.props.getBookmarks());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pendingBookmarks.length < this.props.pendingBookmarks.length) {
      this.props.getBookmarks();
    }
  }

  render() {
    const { intl, reloading, feed, posts } = this.props;

    const content = getFeedContentFromState('bookmarks', 'all', feed, posts);
    const isFetching = getFeedLoadingFromState('bookmarks', 'all', feed) || reloading;
    const hasMore = getFeedHasMoreFromState('bookmarks', 'all', feed);
    const loadContentAction = () => null;
    const loadMoreContentAction = () => null;

    const noBookmarks = !reloading && !isFetching && !content.length;
    const contentMap = content.reduce((postMap, post) => ({ ...postMap, [post.id]: post }), {});
    const sortedBookmarks = _.sortBy(
      this.props.bookmarks,
      bookmark => new Date(bookmark.bookmarkDate),
    ).reverse();
    const mappedContentToBookmarks =
      content.length > 0 ? _.compact(_.map(sortedBookmarks, post => contentMap[post.id])) : [];

    return (
      <div className="shifted">
        <Helmet>
          <title>
            {intl.formatMessage({ id: 'bookmarks', defaultMessage: 'Bookmarks' })} - Busy
          </title>
        </Helmet>
        <div className="feed-layout container">
          <Affix className="leftContainer" stickPosition={77}>
            <div className="left">
              <LeftSidebar />
            </div>
          </Affix>
          <Affix className="rightContainer" stickPosition={77}>
            <div className="right">
              <RightSidebar />
            </div>
          </Affix>
          <div className="center">
            <Feed
              content={mappedContentToBookmarks}
              isFetching={isFetching}
              hasMore={hasMore}
              loadContent={loadContentAction}
              loadMoreContent={loadMoreContentAction}
            />
            {noBookmarks && (
              <div className="container">
                <h3 className="text-center">
                  <FormattedMessage
                    id="bookmarks_empty"
                    defaultMessage="You don't have any story saved."
                  />
                </h3>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
