import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import 'react-select/dist/react-select.css';
import CommentsList from '../components/Comments/Comments';
import * as commentsActions from './commentsActions';
import Loading from '../components/Icon/Loading';
import './Comments.less';

@connect(
  state => ({
    comments: state.comments,
    auth: state.auth,
  }),
  dispatch => bindActionCreators({
    getComments: commentsActions.getComments,
    likeComment: id => commentsActions.likeComment(id),
    unlikeComment: id => commentsActions.likeComment(id, 0),
    dislikeComment: id => commentsActions.likeComment(id, -1000),
  }, dispatch)
)
export default class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortOrder: 'trending',
    };
  }

  static propTypes = {
    post: PropTypes.shape(),
    comments: PropTypes.shape(),
    getComments: PropTypes.func,
  };

  componentDidMount() {
    if (this.props.show) {
      this.props.getComments(this.props.post.id);
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

    if (!show) {
      return <div />;
    }

    const fetchedCommentsList = (comments.listByPostId[postId]
      && comments.listByPostId[postId].list.length) ?
      comments.listByPostId[postId].list.map(id => comments.comments[id]) :
      null;

    let commentsChildren = {};

    if (fetchedCommentsList && fetchedCommentsList.length) {
      commentsChildren = this.getNestedComments(comments, comments.listByPostId[postId].list, {});
    }

    if (!fetchedCommentsList) {
      return (<Loading />);
    }

    if (fetchedCommentsList) {
      return (
        <CommentsList
          parentPost={post}
          comments={fetchedCommentsList}
          auth={this.props.auth}
          commentsChildren={commentsChildren}
          onLikeClick={this.props.likeComment}
          onDislikeClick={this.props.dislikeComment}
        />
      );
    }

    return (
      <div />
    );
  }
}
