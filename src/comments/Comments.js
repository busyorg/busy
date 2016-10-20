import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CommentsList from './CommentsList';
import * as commentsActions from './commentsActions';
import { getCommentsFromState } from './../helpers/stateHelpers';

import './Comments.scss';

@connect(
  state => ({
    comments: state.comments,
  }),
  dispatch => bindActionCreators({
    getComments: commentsActions.getComments,
    showMoreComments: commentsActions.showMoreComments,
  }, dispatch)
)
export default class Comments extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    postId: PropTypes.string.isRequired,
    comments: PropTypes.object,
    getComments: PropTypes.func,
  };

  componentWillMount() {
    this.props.getComments(this.props.postId);
  }

  handleShowMore = (e) => {
    e.stopPropagation();
    this.props.showMoreComments(this.props.postId);
  };

  render() {
    const { postId, comments } = this.props;
    const hasMore = (comments.lists[postId] && comments.lists[postId].hasMore);

    return (
      <div className="Comments">
        <CommentsList postId={postId} comments={comments} />

        <div
          className="Comments__showMore"
          onClick={this.handleShowMore}
          style={{ visibility: hasMore ? 'visible' : 'hidden' }}
        >
          Load more comments...
        </div>

      </div>
    );
  }
}
