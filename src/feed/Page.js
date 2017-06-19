import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import Feed from './Feed';
import PageHOC from './PageHOC';
import {
  getFeedContent,
  getMoreFeedContent,
  getUserFeedContent,
  getMoreUserFeedContent
} from './feedActions';
import {
  getFeedContentFromState,
  getFeedLoadingFromState,
  getUserFeedContentFromState,
  getUserFeedLoadingFromState
} from '../helpers/stateHelpers';
import FavoriteButton from '../favorites/FavoriteButton';
import { notify } from '../app/Notification/notificationActions';
import * as favoriteActions from '../favorites/favoritesActions';
import EmptyFeed from '../statics/EmptyFeed';
import { LeftSidebar, RightSidebar } from '../app/Sidebar/index';
@PageHOC
@connect(
  state => ({
    auth: state.auth,
    feed: state.feed,
    posts: state.posts,
    favorites: state.favorites.categories
  }),
  (dispatch, ownProps) => {
    const { sortBy, category, auth, limit } = ownProps;
    return {
      getFeedContent: () => dispatch(getFeedContent({ sortBy, category, limit })),
      getMoreFeedContent: () => dispatch(getMoreFeedContent({ sortBy, category, limit })),
      getUserFeedContent: () => dispatch(getUserFeedContent({ username: auth.user.name, limit })),
      getMoreUserFeedContent: () =>
        dispatch(getMoreUserFeedContent({ username: auth.user.name, limit })),
      addCategoryFavorite: () => dispatch(favoriteActions.addCategoryFavorite(category)),
      removeCategoryFavorite: () => dispatch(favoriteActions.removeCategoryFavorite(category)),
      notify
    };
  }
)
export default class Page extends React.Component {
  isFavorited() {
    const { category, favorites } = this.props;
    return category && favorites.includes(category);
  }

  render() {
    const { notify, category, sortBy, path, auth, feed, posts } = this.props;
    let content,
      isFetching,
      hasMore,
      loadContentAction,
      loadMoreContentAction;

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
      <div>
        <Helmet>
          <title>Busy</title>
        </Helmet>
        <div className="layout-container" style={{ marginTop: 21 }}>
          <div className="layout-row">
            <div className="layout-col layout-left layout-hidden-sm">
              <LeftSidebar auth={auth} />
            </div>
            <div className="layout-col layout-center">
              {category &&
                <h2 className="mt-3 text-center">
                  <span className="text-info">#</span>
                  {' '}{category}{' '}
                  <FavoriteButton
                    isFavorited={this.isFavorited()}
                    onClick={
                      this.isFavorited()
                        ? this.props.removeCategoryFavorite
                        : this.props.addCategoryFavorite
                    }
                  />
                </h2>}
              <Feed
                content={content}
                isFetching={isFetching}
                hasMore={hasMore}
                loadContent={loadContentAction}
                loadMoreContent={loadMoreContentAction}
                notify={notify}
                route={this.props.route}
              />
              {content.length === 0 && !isFetching && <EmptyFeed />}
            </div>
            <div className="layout-col layout-right layout-hidden-xs">
              <RightSidebar auth={auth} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Page.propTypes = {
  category: React.PropTypes.string,
  sortBy: React.PropTypes.string,
  path: React.PropTypes.string,
  limit: React.PropTypes.number
};
