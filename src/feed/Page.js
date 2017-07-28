import React, { PropTypes } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import Feed from './Feed';
import {
  getFeedContent,
  getMoreFeedContent,
  getUserFeedContent,
  getMoreUserFeedContent,
} from './feedActions';
import {
  getFeedContentFromState,
  getFeedLoadingFromState,
  getUserFeedContentFromState,
  getUserFeedLoadingFromState,
  getFeedHasMoreFromState,
} from '../helpers/stateHelpers';
import EmptyFeed from '../statics/EmptyFeed';
import { LeftSidebar, RightSidebar } from '../app/Sidebar/index';
import TopicSelector from '../components/TopicSelector';
import Affix from '../components/Utils/Affix';
import ScrollToTop from '../components/Utils/ScrollToTop';

@connect(
  state => ({
    auth: state.auth,
    feed: state.feed,
    posts: state.posts,
  }),
  dispatch => ({
    getFeedContent: sortBy => dispatch(getFeedContent({ sortBy, limit: 10 })),
    getMoreFeedContent: sortBy => dispatch(getMoreFeedContent({ sortBy, limit: 10 })),
    getUserFeedContent: username => dispatch(getUserFeedContent({ username, limit: 10 })),
    getMoreUserFeedContent: username => dispatch(getMoreUserFeedContent({ username, limit: 10 })),
  })
)
@withRouter
class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentKey: 'trending',
    };
  }

  componentDidMount() {
    const { auth } = this.props;
    if (auth && auth.isAuthenticated) {
      this.props.getUserFeedContent(auth.user.name);
    } else {
      this.props.getFeedContent(this.state.currentKey);
    }
  }

  componentWillReceiveProps(nextProps) {
    const wasAuthenticated = this.props.auth && this.props.auth.isAuthenticated;
    const isAuthenticated = nextProps.auth && nextProps.auth.isAuthenticated;
    if (!wasAuthenticated && isAuthenticated) {
      this.props.getUserFeedContent(nextProps.auth.user.name);
    }
  }

  handleSortChange = (key) => {
    this.setState({ currentKey: key });
    this.props.getFeedContent(key);
  };

  render() {
    const { auth, feed, posts } = this.props;
    const { currentKey } = this.state;

    let content = [];
    let isFetching = false;
    let hasMore = false;
    let loadMoreContentAction;

    if (auth && auth.isAuthenticated) {
      content = getUserFeedContentFromState(auth.user.name, feed, posts);
      isFetching = getUserFeedLoadingFromState(auth.user.name, feed);
      hasMore = feed.created[auth.user.name] ? feed.created[auth.user.name].hasMore : true;
      loadMoreContentAction = () => this.props.getMoreUserFeedContent(auth.user.name);
    } else {
      content = getFeedContentFromState(currentKey, undefined, feed, posts);
      isFetching = getFeedLoadingFromState(currentKey, undefined, feed);
      hasMore = getFeedHasMoreFromState(currentKey, undefined, feed);
      loadMoreContentAction = () => this.props.getMoreFeedContent(currentKey);
    }

    return (
      <div>
        <Helmet>
          <title>Busy</title>
        </Helmet>
        <ScrollToTop />
        <div className="shifted">
          <div className="feed-layout container">
            <Affix className="leftContainer" stickPosition={77}>
              <div className="left">
                <LeftSidebar auth={auth} />
              </div>
            </Affix>
            <Affix className="rightContainer" stickPosition={77}>
              <div className="right">
                <RightSidebar auth={auth} />
              </div>
            </Affix>
            <div className="center">
              <TopicSelector
                isSingle={false}
                defaultSort={this.state.currentKey}
                topics={[]}
                onSortChange={this.handleSortChange}
              />
              <Feed
                content={content}
                isFetching={isFetching}
                hasMore={hasMore}
                loadMoreContent={loadMoreContentAction}
              />
              {!content.length && !isFetching && <EmptyFeed />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Page;
