import React from 'react';
import { bindActionCreators } from 'redux';
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


@PageHOC
@connect(
  state => ({
    feed: state.feed,
    posts: state.posts,
  }),
  (dispatch, ownProps) => {
    const { sortBy, category, auth, limit } = ownProps;
    return {
      getFeedContent: () => dispatch(
        getFeedContent({sortBy, category, limit})
      ),
      getMoreFeedContent: () => dispatch(
        getMoreFeedContent({sortBy, category, limit})
      ),
      getUserFeedContent: () => dispatch(
        getUserFeedContent({ username: auth.user.name, limit})
      ),
      getMoreUserFeedContent: () => dispatch(
        getMoreUserFeedContent({ username: auth.user.name, limit})
      ),
    }
  }
)
export default class Page extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { account, category, sortBy, path, auth, feed, posts, limit } = this.props;

    let content, isLoading, loadContentAction, loadMoreContentAction;

    if(!path && auth.isAuthenticated) {
      content = getUserFeedContentFromState(auth.user.name, feed, posts);
      isLoading = getUserFeedLoadingFromState(auth.user.name, feed);
      loadContentAction = this.props.getUserFeedContent;
      loadMoreContentAction = this.props.getMoreUserFeedContent;
    } else {
      content = getFeedContentFromState(sortBy, category, feed, posts);
      isLoading = getFeedLoadingFromState(sortBy, category, feed);
      loadContentAction = this.props.getFeedContent;
      loadMoreContentAction = this.props.getMoreFeedContent;
    }

    return (
      <div className="main-panel">
        { auth.isFetching?
          <div>
            <Header
              account={account}
              category={category}
            />
            <h1>Logging in...</h1>
          </div>
        :
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Header
              account={account}
              category={category}
            />
            <PageActions
              messages
              add
            />
            <Feed
              content={content}
              isLoading={isLoading}
              loadContent={loadContentAction}
              loadMoreContent={loadMoreContentAction}
            />
          </div>
        }
      </div>
    );
  }
};

Page.propTypes = {
  account: React.PropTypes.string,
  category: React.PropTypes.string,
  sortBy: React.PropTypes.string,
  path: React.PropTypes.string,
  limit: React.PropTypes.number,
};
