import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getIsAuthenticated, getAuthenticatedUserName, getFeed } from '../reducers';
import {
  getFeedFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
} from '../helpers/stateHelpers';
import { showPostModal } from '../app/appActions';
import { getReplies, getMoreReplies } from '../feed/feedActions';
import Feed from '../feed/Feed';
import Loading from '../components/Icon/Loading';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import PostModal from '../post/PostModalContainer';
import requiresLogin from '../auth/requiresLogin';

class Replies extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    authenticated: PropTypes.bool.isRequired,
    showPostModal: PropTypes.func.isRequired,
    username: PropTypes.string,
    feed: PropTypes.shape(),
    getReplies: PropTypes.func,
    getMoreReplies: PropTypes.func,
  };

  static defaultProps = {
    authenticated: false,
    username: '',
    feed: {},
    posts: {},
    getReplies: () => {},
    getMoreReplies: () => {},
  };

  componentDidMount() {
    const { username, feed, authenticated } = this.props;
    const content = getFeedFromState('replies', username, feed);
    if (authenticated && _.isEmpty(content)) {
      this.props.getReplies();
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.authenticated && !this.props.authenticated) {
      nextProps.getReplies();
    }
  }

  render() {
    const { intl, authenticated, username, feed } = this.props;

    if (!authenticated) return <Loading />;

    const content = getFeedFromState('replies', username, feed);
    const fetching = getFeedLoadingFromState('replies', username, feed);
    const hasMore = getFeedHasMoreFromState('replies', username, feed);

    return (
      <div className="shifted">
        <Helmet>
          <title>{intl.formatMessage({ id: 'replies', defaultMessage: 'Replies' })} - Busy</title>
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
              isFetching={fetching}
              hasMore={hasMore}
              loadMoreContent={this.props.getMoreReplies}
              showPostModal={this.props.showPostModal}
            />
            <PostModal />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: getIsAuthenticated(state),
  username: getAuthenticatedUserName(state),
  feed: getFeed(state),
});

export default requiresLogin(
  injectIntl(connect(mapStateToProps, { getReplies, getMoreReplies, showPostModal })(Replies)),
);
