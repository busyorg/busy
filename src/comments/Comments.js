import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getComments, getIsAuthenticated, getAuthenticatedUserName } from '../reducers';
import CommentsList from '../components/Comments/Comments';
import * as commentsActions from './commentsActions';
import { notify } from '../app/Notification/notificationActions';
import './Comments.less';

@connect(
  state => ({
    comments: getComments(state),
    authenticated: getIsAuthenticated(state),
    username: getAuthenticatedUserName(state),
  }),
  dispatch => bindActionCreators({
    getComments: commentsActions.getComments,
    likeComment: id => commentsActions.likeComment(id),
    sendComment: (parentPost, body) => commentsActions.sendCommentV2(parentPost, body),
    dislikeComment: id => commentsActions.likeComment(id, -1000),
    notify,
  }, dispatch),
)
export default class Comments extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    username: PropTypes.string,
    post: PropTypes.shape(),
    comments: PropTypes.shape(),
    show: PropTypes.bool,
    getComments: PropTypes.func,
    likeComment: PropTypes.func,
    dislikeComment: PropTypes.func,
    sendComment: PropTypes.func,
  };

  static defaultProps = {
    username: undefined,
    post: {},
    comments: {},
    show: false,
    getComments: () => {},
    likeComment: () => {},
    dislikeComment: () => {},
    sendComment: () => {},
  }

  state = {
    sortOrder: 'trending',
    isFetchedOnce: false,
  };

  componentDidMount() {
    if (this.props.show) {
      this.props.getComments(this.props.post.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { comments, post, show } = this.props;

    if (nextProps.show && (nextProps.post.id !== post.id || !show)) {
      this.props.getComments(nextProps.post.id);
    }

    if (comments.listByPostId[post.id] && comments.listByPostId[post.id].isFetching) {
      if (!this.state.isFetchedOnce) {
        this.setState({ isFetchedOnce: true });
      }
    }
  }

  getNestedComments = (commentsObj, commentsIdArray, nestedComments) => {
    const newNestedComments = nestedComments;
    commentsIdArray.forEach((commentId) => {
      const nestedCommentArray = commentsObj.listByCommentId[commentId];
      if (nestedCommentArray.length) {
        newNestedComments[commentId] = nestedCommentArray.map(id => commentsObj.comments[id]);
        this.getNestedComments(commentsObj, nestedCommentArray, newNestedComments);
      }
    });
    return newNestedComments;
  }

  render() {
    const { post, comments, show } = this.props;
    const postId = post.id;
    let fetchedCommentsList = null;

    if (comments.listByPostId[postId] && comments.listByPostId[postId].list instanceof Array) {
      if (comments.listByPostId[postId].list.length) {
        fetchedCommentsList = comments.listByPostId[postId].list.map(id => comments.comments[id]);
      } else {
        fetchedCommentsList = [];
      }
    }
    fetchedCommentsList = (comments.listByPostId[postId]
      && comments.listByPostId[postId].list.length) ?
      comments.listByPostId[postId].list.map(id => comments.comments[id]) :
      [];

    let commentsChildren = {};

    if (fetchedCommentsList && fetchedCommentsList.length) {
      commentsChildren = this.getNestedComments(comments, comments.listByPostId[postId].list, {});
    }

    let loading = false;

    if (comments.listByPostId[post.id]
      && comments.listByPostId[post.id].isFetching
      && !this.state.isFetchedOnce) {
      loading = true;
    }

    if (fetchedCommentsList instanceof Array) {
      return (
        <CommentsList
          parentPost={post}
          comments={fetchedCommentsList}
          authenticated={this.props.authenticated}
          username={this.props.username}
          commentsChildren={commentsChildren}
          loading={loading}
          show={show}
          onLikeClick={this.props.likeComment}
          onDislikeClick={this.props.dislikeComment}
          onSendComment={this.props.sendComment}
        />
      );
    }

    return <div />;
  }
}
