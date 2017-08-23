import React from 'react';
import PropTypes from 'prop-types';
import { find } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  getComments,
  getCommentsList,
  getCommentsPendingVotes,
  getIsAuthenticated,
  getAuthenticatedUserName,
} from '../reducers';
import CommentsList from '../components/Comments/Comments';
import * as commentsActions from './commentsActions';
import { notify } from '../app/Notification/notificationActions';
import './Comments.less';

@connect(
  state => ({
    comments: getComments(state),
    commentsList: getCommentsList(state),
    pendingVotes: getCommentsPendingVotes(state),
    authenticated: getIsAuthenticated(state),
    username: getAuthenticatedUserName(state),
  }),
  dispatch => bindActionCreators({
    getComments: commentsActions.getComments,
    voteComment: (id, percent) => commentsActions.likeComment(id, percent),
    sendComment: (parentPost, body) => commentsActions.sendCommentV2(parentPost, body),
    notify,
  }, dispatch),
)
export default class Comments extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    username: PropTypes.string,
    post: PropTypes.shape(),
    comments: PropTypes.shape(),
    commentsList: PropTypes.shape(),
    pendingVotes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      percent: PropTypes.number,
    })),
    show: PropTypes.bool,
    getComments: PropTypes.func,
    voteComment: PropTypes.func,
    sendComment: PropTypes.func,
  };

  static defaultProps = {
    username: undefined,
    post: {},
    comments: {},
    commentsList: {},
    pendingVotes: [],
    show: false,
    getComments: () => {},
    voteComment: () => {},
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

  handleLikeClick = (id) => {
    const { commentsList, pendingVotes, username } = this.props;
    if (pendingVotes[id]) return;

    const userVote = find(commentsList[id].active_votes, { voter: username }) || {};

    if (userVote.percent > 0) {
      this.props.voteComment(id, 0);
    } else {
      this.props.voteComment(id, 10000);
    }
  }

  handleDisLikeClick = (id) => {
    const { commentsList, pendingVotes, username } = this.props;
    if (pendingVotes[id]) return;

    const userVote = find(commentsList[id].active_votes, { voter: username }) || {};

    if (userVote.percent < 0) {
      this.props.voteComment(id, 0);
    } else {
      this.props.voteComment(id, -10000);
    }
  }


  render() {
    const { post, comments, pendingVotes, show } = this.props;
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
          pendingVotes={pendingVotes}
          loading={loading}
          show={show}
          onLikeClick={this.handleLikeClick}
          onDislikeClick={this.handleDisLikeClick}
          onSendComment={this.props.sendComment}
        />
      );
    }

    return <div />;
  }
}
