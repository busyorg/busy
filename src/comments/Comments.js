import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CommentsList from './CommentsList';
import * as commentsActions from './commentsActions';
import Loading from '../widgets/Loading';

import './Comments.scss';

@connect(
  state => ({
    comments: state.comments,
    auth: state.auth,
  }),
  dispatch => bindActionCreators({
    getComments: commentsActions.getComments,
    showMoreComments: commentsActions.showMoreComments,
    likeComment: (id) => commentsActions.likeComment(id),
    unlikeComment: (id) => commentsActions.likeComment(id, 0),
    openCommentingDraft: commentsActions.openCommentingDraft,
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
    className: PropTypes.string,
  };

  componentWillMount() {
    this.props.getComments(this.props.postId);
  }

  handleShowMore = (e) => {
    e.stopPropagation();
    this.props.showMoreComments(this.props.postId);
  };

  render() {
    const { postId, comments, className } = this.props;
    const hasMore = (comments.lists[postId] && comments.lists[postId].hasMore);
    const isFetching = (comments.lists[postId] && comments.lists[postId].isFetching);
    const classNames = className ? `Comments ${className}` : 'Comments';
    return (
      <div className={classNames}>
        <CommentsList
          postId={postId}
          comments={comments}
          likeComment={this.props.likeComment}
          unlikeComment={this.props.unlikeComment}
          auth={this.props.auth}
          openCommentingDraft={this.props.openCommentingDraft}
        />

        { isFetching &&
          <Loading />
        }

        { hasMore &&
          <a
            className="Comments__showMore"
            tabIndex="0"
            onClick={this.handleShowMore}
          >
            See More Comments
          </a>
        }

      </div>
    );
  }
}
