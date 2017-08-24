import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getFeed, getPosts } from '../reducers';
import Feed from '../feed/Feed';
import {
  getFeedContentFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
} from '../helpers/stateHelpers';
import { getBookmarks } from './bookmarksActions';

@connect(
  state => ({
    feed: getFeed(state),
    posts: getPosts(state),
  }),
  dispatch => ({
    getBookmarks: () => dispatch(getBookmarks()),
  }),
)
export default class Bookmarks extends React.Component {
  static propTypes = {
    feed: PropTypes.shape().isRequired,
    posts: PropTypes.shape().isRequired,
    getBookmarks: PropTypes.func,
  };

  static defaultProps = {
    getBookmarks: () => {},
  };

  componentDidMount() {
    this.props.getBookmarks();
  }

  render() {
    const { feed, posts } = this.props;

    const content = getFeedContentFromState('bookmarks', 'all', feed, posts);
    const isFetching = getFeedLoadingFromState('bookmarks', 'all', feed);
    const hasMore = getFeedHasMoreFromState('bookmarks', 'all', feed);
    const loadContentAction = () => null;
    const loadMoreContentAction = () => null;

    return (
      <div className="main-panel">
        <div className="my-5">
          <h1 className="text-center">
            <FormattedMessage id="bookmarks" />
          </h1>
          <Feed
            content={content}
            isFetching={isFetching}
            hasMore={hasMore}
            loadContent={loadContentAction}
            loadMoreContent={loadMoreContentAction}
          />
          {!isFetching &&
            !content.length &&
            <div className="container">
              <h3 className="text-center">
                <FormattedMessage id="bookmarks_empty" />
              </h3>
            </div>}
        </div>
      </div>
    );
  }
}
