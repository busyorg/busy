import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Feed from '../feed/Feed';
import { getFeed, getPosts } from '../reducers';
import {
  getFeedContentFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
} from '../helpers/stateHelpers';
import { getFeedContent, getMoreFeedContent } from '../feed/feedActions';

@connect(
  state => ({
    feed: getFeed(state),
    posts: getPosts(state),
  }),
  {
    getFeedContent,
    getMoreFeedContent,
  },
)
export default class UserProfileFeed extends React.Component {
  static propTypes = {
    feed: PropTypes.shape(),
    posts: PropTypes.shape(),
    match: PropTypes.shape(),
    limit: PropTypes.number,
    getFeedContent: PropTypes.func,
    getMoreFeedContent: PropTypes.func,
  };

  static defaultProps = {
    feed: {},
    posts: {},
    match: {},
    limit: 10,
    getFeedContent: () => {},
    getMoreFeedContent: () => {},
  };

  componentDidMount() {
    this.props.getFeedContent({
      sortBy: 'feed',
      category: this.props.match.params.name,
      limit: this.props.limit,
    });
  }

  render() {
    const { feed, posts } = this.props;
    const username = this.props.match.params.name;
    const content = getFeedContentFromState('feed', username, feed, posts);
    const isFetching = getFeedLoadingFromState('feed', username, feed);
    const hasMore = getFeedHasMoreFromState('feed', username, feed);
    const loadMoreContentAction = () =>
      this.props.getMoreFeedContent({
        sortBy: 'feed',
        username,
        limit: this.props.limit,
      });

    return (
      <Feed
        content={content}
        isFetching={isFetching}
        hasMore={hasMore}
        loadMoreContent={loadMoreContentAction}
      />
    );
  }
}
