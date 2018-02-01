import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { getIsAuthenticated, getAuthenticatedUserName, getFeed, getPosts } from '../reducers';
import {
  getFeedContentFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
} from '../helpers/stateHelpers';
import { getReplies, getMoreReplies } from '../feed/feedActions';
import Feed from '../feed/Feed';
import Loading from '../components/Icon/Loading';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import requiresLogin from '../auth/requiresLogin';

export class IReplies extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    authenticated: PropTypes.bool.isRequired,
    username: PropTypes.string,
    feed: PropTypes.shape(),
    posts: PropTypes.shape(),
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
    if (this.props.authenticated) {
      this.props.getReplies();
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.authenticated && !this.props.authenticated) {
      nextProps.getReplies();
    }
  }

  render() {
    const { intl, authenticated, username, feed, posts } = this.props;

    if (!authenticated) return <Loading />;

    const content = getFeedContentFromState('replies', username, feed, posts);
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
            />
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
  posts: getPosts(state),
});

export default requiresLogin(
  injectIntl(connect(mapStateToProps, { getReplies, getMoreReplies })(IReplies)),
);
