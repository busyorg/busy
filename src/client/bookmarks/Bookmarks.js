import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { getFeed, getPosts, getPendingBookmarks, getIsReloading } from '../reducers';
import Feed from '../feed/Feed';
import {
  getFeedFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
} from '../helpers/stateHelpers';
import { reload } from '../auth/authActions';
import { getBookmarks } from '../feed/feedActions';
import { showPostModal } from '../app/appActions';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import requiresLogin from '../auth/requiresLogin';
import PostModal from '../post/PostModalContainer';

@requiresLogin
@injectIntl
@connect(
  state => ({
    feed: getFeed(state),
    posts: getPosts(state),
    pendingBookmarks: getPendingBookmarks(state),
    reloading: getIsReloading(state),
  }),
  { getBookmarks, reload, showPostModal },
)
export default class Bookmarks extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    reloading: PropTypes.bool,
    feed: PropTypes.shape().isRequired,
    pendingBookmarks: PropTypes.arrayOf(PropTypes.number),
    getBookmarks: PropTypes.func,
    reload: PropTypes.func,
    showPostModal: PropTypes.func,
  };

  static defaultProps = {
    reloading: false,
    pendingBookmarks: [],
    getBookmarks: () => {},
    reload: () => {},
    showPostModal: () => {},
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
    const { intl, reloading, feed } = this.props;

    const content = getFeedFromState('bookmarks', 'all', feed);
    const isFetching = getFeedLoadingFromState('bookmarks', 'all', feed) || reloading;
    const hasMore = getFeedHasMoreFromState('bookmarks', 'all', feed);
    const loadContentAction = () => null;
    const loadMoreContentAction = () => null;

    const noBookmarks = !reloading && !isFetching && !content.length;

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
              content={content}
              isFetching={isFetching}
              hasMore={hasMore}
              loadContent={loadContentAction}
              loadMoreContent={loadMoreContentAction}
              showPostModal={this.props.showPostModal}
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
        <PostModal />
      </div>
    );
  }
}
