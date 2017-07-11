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
    showMoreComments: commentsActions.showMoreComments,
    likeComment: id => commentsActions.likeComment(id),
    unlikeComment: id => commentsActions.likeComment(id, 0),
    dislikeComment: id => commentsActions.likeComment(id, -1000),
    openCommentingDraft: commentsActions.openCommentingDraft,
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
    postId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
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
    const postChanged = (this.props.postId && prevProps.postId !== this.props.postId);
    const showToggled = (this.props.show && prevProps.show !== this.props.show);
    if (showToggled || postChanged) {
      this.props.getComments(this.props.postId);
    }
  }

  handleShowMore = (e) => {
    e.stopPropagation();
    this.props.showMoreComments(this.props.postId);
  };

  handleSortChange = ({ value }) => {
    if (value !== this.state.sortOrder) {
      this.setState({ sortOrder: value });
    }
  };

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
    const { postId, comments, show } = this.props;

    if (!show) {
      return <div />;
    }

    const isFetching = (comments.listByPostId[postId] && comments.listByPostId[postId].isFetching);

    const fetchedCommentsList = (isFetching === false) ?
      comments.listByPostId[postId].list.map(id => comments.comments[id]) :
      null;

    let commentsChildren = {};

    if (fetchedCommentsList && fetchedCommentsList.length) {
      commentsChildren = this.getNestedComments(comments, comments.listByPostId[postId].list, {});
    }

    if (isFetching || !fetchedCommentsList) {
      return (<Loading />);
    }

    if (fetchedCommentsList && fetchedCommentsList.length) {
      return (
        <CommentsList
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
