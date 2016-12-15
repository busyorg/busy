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
    likeComment: id => commentsActions.likeComment(id),
    unlikeComment: id => commentsActions.likeComment(id, 0),
    openCommentingDraft: commentsActions.openCommentingDraft,
  }, dispatch)
)
export default class Comments extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    postId: PropTypes.number.isRequired,
    comments: PropTypes.object,
    getComments: PropTypes.func,
    className: PropTypes.string,
  };

  componentDidMount() {
    if (this.props.show) {
      this.props.getComments(this.props.postId);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.show && prevProps.show !== this.props.show) {
      this.props.getComments(this.props.postId);
    }
  }

  componentWillReceiveProps(nextProps) {
    const postId = this.props.postId;
    if (this.props.show && this.props.hide && postId) {
      const comments = nextProps.comments.listByPostId[postId];
      if (!comments.isFetching && comments.list.length === 0) {
        this.props.hide();
      }
    }
  }

  handleShowMore = (e) => {
    e.stopPropagation();
    this.props.showMoreComments(this.props.postId);
  };

  render() {
    const { postId, comments, className, show } = this.props;
    if (!show) {
      return null;
    }

    const hasMore = (comments.listByPostId[postId] && comments.listByPostId[postId].hasMore);
    const isFetching = (comments.listByPostId[postId] && comments.listByPostId[postId].isFetching);

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
          isSinglePage={this.props.isSinglePage}
        />

        {isFetching &&
          <Loading />
        }

        {(hasMore && !this.props.isSinglePage) &&
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
