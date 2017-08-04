import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Feed from '../feed/Feed';
import * as userActions from './userActions';
import {
  getFeedContentFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState,
} from '../helpers/stateHelpers';

@connect(
  state => ({
    feed: state.feed,
    posts: state.posts,
  }),
  dispatch =>
    bindActionCreators(
      {
        getUserReplies: userActions.getUserReplies,
        getMoreUserReplies: userActions.getMoreUserReplies,
      },
      dispatch,
    ),
)
export default class UserReplies extends React.Component {
  static propTypes = {
    feed: PropTypes.shape(),
    posts: PropTypes.shape(),
    match: PropTypes.shape(),
    getUserReplies: PropTypes.func,
    getMoreUserReplies: PropTypes.func,
  };

  static defaultProps = {
    feed: {},
    posts: {},
    match: {},
    limit: 10,
    getUserReplies: () => {},
    getMoreUserReplies: () => {},
  };

  static needs = [({ name }) => userActions.getUserReplies({ username: name })];

  render() {
    const { feed, posts, match, getUserReplies, getMoreUserReplies } = this.props;

    const username = match.params.name;
    const content = getFeedContentFromState('replies', username, feed, posts);
    const isFetching = getFeedLoadingFromState('replies', username, feed);
    const hasMore = getFeedHasMoreFromState('replies', username, feed);
    const loadContentAction = () => getUserReplies({ username });
    const loadMoreContentAction = () => getMoreUserReplies(username);

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
