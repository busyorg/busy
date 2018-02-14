import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Feed from '../feed/Feed';
import { getFeed } from '../reducers';
import {
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
  getFeedFromState,
} from '../helpers/stateHelpers';
import { getFeedContent, getMoreFeedContent } from '../feed/feedActions';

@connect(
  state => ({
    feed: getFeed(state),
  }),
  {
    getFeedContent,
    getMoreFeedContent,
  },
)
export default class UserProfileFeed extends React.Component {
  static propTypes = {
    feed: PropTypes.shape(),
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
    const { feed } = this.props;
    const username = this.props.match.params.name;
    const content = getFeedFromState('feed', username, feed);
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
