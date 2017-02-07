import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Feed from '../feed/Feed';
import * as userActions from './userActions';
import {
  getFeedContentFromState,
  getFeedLoadingFromState,
  getFeedHasMoreFromState
} from '../helpers/stateHelpers';

@connect(
  state => ({
    feed: state.feed,
    posts: state.posts,
  }),
  dispatch => bindActionCreators({
    getUserReplies: userActions.getUserReplies
  }, dispatch)
)
export default class UserReplies extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { getUserReplies, feed, posts } = this.props;

    const username = this.props.params.name;
    const content = getFeedContentFromState('replies', username, feed, posts);
    const isFetching = getFeedLoadingFromState('replies', username, feed);
    const hasMore = getFeedHasMoreFromState('replies', username, feed);
    const loadContentAction = () => getUserReplies(username);
    const loadMoreContentAction = () => undefined;

    return (
      <div>
        <Feed
          content={content}
          isFetching={isFetching}
          hasMore={hasMore}
          loadContent={loadContentAction}
          loadMoreContent={loadMoreContentAction}
          route={this.props.route}
        />
      </div>
    );
  }
}
