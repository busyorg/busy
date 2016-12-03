import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../app/Header';
import MenuFeed from '../app/Menu/MenuFeed';
import TriggerFeed from '../app/Trigger/TriggerFeed';
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
} from '../helpers/stateHelpers';
import * as commentsActions from '../comments/commentsActions';
import { toggleBookmark } from '../bookmarks/bookmarksActions';
import Loading from '../widgets/Loading';
import Icon from '../widgets/Icon';


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
    };
  }
)
export default class Page extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { notify, category, sortBy, path, auth, feed, posts } = this.props;

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
        <Header />
        <MenuFeed category={category} />
        { category &&
          <h2 className="mt-1 mb-0 align-center">
            <Icon name="star_border" sm />{ ' ' }
            #{ category }
          </h2>
        }

        { auth.isAuthenticated && <TriggerFeed category={category} /> }
        { auth.isFetching && <Loading /> }
        { !auth.isFetching &&
          <Feed
            content={content}
            isFetching={isFetching}
            hasMore={hasMore}
            loadContent={loadContentAction}
            loadMoreContent={loadMoreContentAction}
            notify={notify}
            route={this.props.route}
          />
        }
      </div>
    );
  }
}

Page.propTypes = {
  category: React.PropTypes.string,
  sortBy: React.PropTypes.string,
  path: React.PropTypes.string,
  limit: React.PropTypes.number,
};
