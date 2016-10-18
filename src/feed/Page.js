import React from 'react';
import { connect } from 'react-redux';
import Header from './../app/header';
import PageActions from './../app/PageActions';
import Feed from './Feed';
import PageHOC from './PageHOC';
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
} from './../helpers/stateHelpers';
import { toggleBookmark } from './../bookmarks/bookmarksActions';

@PageHOC
@connect(
  state => ({
    feed: state.feed,
    posts: state.posts,
    bookmarks: state.bookmarks,
  }),
  (dispatch, ownProps) => {
    const { sortBy, category, auth, limit } = ownProps;
    return {
      getFeedContent: () => dispatch(
        getFeedContent({ sortBy, category, limit })
      ),
      getMoreFeedContent: () => dispatch(
        getMoreFeedContent({ sortBy, category, limit })
      ),
      getUserFeedContent: () => dispatch(
        getUserFeedContent({ username: auth.user.name, limit })
      ),
      getMoreUserFeedContent: () => dispatch(
        getMoreUserFeedContent({ username: auth.user.name, limit })
      ),
      toggleBookmark: (postId) => dispatch(
        toggleBookmark({ postId })
      ),
    };
  }
)

export default class Page extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { account, category, sortBy, path, auth, feed, posts, limit } = this.props;

    let content, isFetching, hasMore, loadContentAction, loadMoreContentAction;

    if (!path && auth.isAuthenticated) {
      content = getUserFeedContentFromState(auth.user.name, feed, posts);
      isFetching = getUserFeedLoadingFromState(auth.user.name, feed);
      hasMore = feed[sortBy][auth.user.name] ? feed[sortBy][auth.user.name].hasMore : true;
      loadContentAction = this.props.getUserFeedContent;
      loadMoreContentAction = this.props.getMoreUserFeedContent;
    } else {
      content = getFeedContentFromState(sortBy, category, feed, posts);
      isFetching = getFeedLoadingFromState(sortBy, category, feed);
      hasMore = feed[sortBy][category] ? feed[sortBy][category].hasMore : true;
      loadContentAction = this.props.getFeedContent;
      loadMoreContentAction = this.props.getMoreFeedContent;
    }

    return (
      <div className="main-panel">
        <Header
          account={account}
          category={category}
        />
        {auth.isAuthenticated &&
          <PageActions
            messages
            add
          />}
        {!auth.isFetching &&
          <Feed
            content={content}
            isFetching={isFetching}
            hasMore={hasMore}
            loadContent={loadContentAction}
            loadMoreContent={loadMoreContentAction}
            toggleBookmark={this.props.toggleBookmark}
          />}
      </div>
    );
  }
}

Page.propTypes = {
  account: React.PropTypes.string,
  category: React.PropTypes.string,
  sortBy: React.PropTypes.string,
  path: React.PropTypes.string,
  limit: React.PropTypes.number,
};
