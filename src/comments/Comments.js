import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import 'react-select/dist/react-select.css';
import CommentsList from '../components/Comments/Comments';
import * as commentsActions from './commentsActions';
import Loading from '../components/Icon/Loading';
import { notify } from '../app/Notification/notificationActions';
import './Comments.less';

@connect(
  state => ({
    comments: state.comments,
    auth: state.auth,
  }),
  dispatch => bindActionCreators({
    getComments: commentsActions.getComments,
    likeComment: id => commentsActions.likeComment(id),
    sendComment: (parentPost, body) => commentsActions.sendCommentV2(parentPost, body),
    unlikeComment: id => commentsActions.likeComment(id, 0),
    dislikeComment: id => commentsActions.likeComment(id, -1000),
    notify,
  }, dispatch)
)
export default class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortOrder: 'trending',
      isFetchedOnce: false,
    };
  }

  static propTypes = {
    post: PropTypes.shape(),
    comments: PropTypes.shape(),
    getComments: PropTypes.func,
  };

  static defaultProps = {
    post: {},
    comments: {},
    getComments: () => {},
  }

  componentDidMount() {
    if (this.props.show) {
      this.props.getComments(this.props.post.id);
    }
  }

  componentWillReceiveProps() {
    const { comments, post } = this.props;

    if (comments.listByPostId[post.id] && comments.listByPostId[post.id].isFetching) {
      if (!this.state.isFetchedOnce) {
        this.setState({ isFetchedOnce: true });
      }
    }
  }

  getNestedComments = (commentsObj, commentsIdArray, nestedComments) => {
    commentsIdArray.forEach((commentId) => {
      const nestedCommentArray = commentsObj.listByCommentId[commentId];
      if (nestedCommentArray.length) {
        nestedComments[commentId] = nestedCommentArray.map(id => commentsObj.comments[id]);
        this.getNestedComments(commentsObj, nestedCommentArray, nestedComments);
      }
    });
    return nestedComments;
  }

  render() {
    const { post, comments, show } = this.props;
    const postId = post.id;
    let fetchedCommentsList = null;

    if (!show) {
      return <div />;
    }

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

    if (comments.listByPostId[post.id]
      && comments.listByPostId[post.id].isFetching
      && !this.state.isFetchedOnce) {
      return <Loading />;
    }

    if (fetchedCommentsList instanceof Array) {
      return (
        <CommentsList
          parentPost={post}
          comments={fetchedCommentsList}
          auth={this.props.auth}
          commentsChildren={commentsChildren}
          onLikeClick={this.props.likeComment}
          onDislikeClick={this.props.dislikeComment}
          onSendComment={this.props.sendComment}
          notify={this.props.notify}
        />
      );
    }

    return <div />;
    // Todo handle when comment fetch failed.
  }
}
