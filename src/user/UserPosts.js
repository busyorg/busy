import React, { PropTypes } from 'react';
import Feed from '../feed/Feed';
import {
  getUserCommentsFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
} from '../helpers/stateHelpers';
import { getUserComments as getUserCommentsStatic } from './userActions';

export default class UserProfilePosts extends React.Component {
  static propTypes = {
    feed: PropTypes.shape().isRequired,
    comments: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    limit: PropTypes.number,
    getUserComments: PropTypes.func,
    getMoreUserComments: PropTypes.func,
  };

  static defaultProps = {
    limit: 10,
    getUserComments: () => {},
    getMoreUserComments: () => {},
  };

  static needs = [({ name }) => getUserCommentsStatic({ username: name })];

  render() {
    const { feed, comments, match, limit, getUserComments, getMoreUserComments } = this.props;
    const username = match.params.name;

    const content = getUserCommentsFromState(username, feed, comments);
    const isFetching = getFeedLoadingFromState('comments', username, feed);
    const hasMore = getFeedHasMoreFromState('comments', username, feed);
    const loadContentAction = () => getUserComments({ username });
    const loadMoreContentAction = () => getMoreUserComments(username, limit);

    return (
      <Feed
        content={content}
        isFetching={isFetching}
        hasMore={hasMore}
        loadContent={loadContentAction}
        loadMoreContent={loadMoreContentAction}
      />
    );
  }
}
