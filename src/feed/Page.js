import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import steemconnect from 'steemconnect';
import Header from '../app/Header';
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
import Loading from '../widgets/Loading';
import * as favoriteActions from '../favorites/favoritesActions';
import EmptyFeed from '../statics/EmptyFeed';

@PageHOC
@connect(
  state => ({
    feed: state.feed,
    posts: state.posts,
    favorites: state.favorites.categories,
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
      addCategoryFavorite: () => dispatch(
        favoriteActions.addCategoryFavorite(category)
      ),
      removeCategoryFavorite: () => dispatch(
        favoriteActions.removeCategoryFavorite(category)
      ),
    };
  }
)
export default class Page extends React.Component {
  constructor(props) {
    super(props);
  }

  isFavorited() {
    const { category, favorites } = this.props;
    return category && favorites.includes(category);
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
        <Header category={category || 'general'} sortBy={sortBy} />
        {!auth.isFetching && !auth.isAuthenticated && !category &&
          <div className="my-5 text-center">
            <div className="container">
              <h1>Join Busy today.</h1>
              <a
                className="btn btn-success"
                href="https://steemit.com/enter_email"
                target="_blank"
              >
                <FormattedMessage id="signup" />
              </a>
              {' or '}
              <a href={steemconnect.getLoginURL()}>
                <FormattedMessage id="login" />
              </a>
            </div>
          </div>
        }
        {auth.isFetching && <Loading />}
        {!auth.isFetching &&
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
        {(content.length === 0 && !isFetching) &&
          <EmptyFeed />
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
