import React from 'react';
import PropTypes from 'prop-types';
import { find } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getHasDefaultSlider } from '../helpers/user';
import {
  getAuthenticatedUser,
  getComments,
  getCommentsList,
  getCommentsPendingVotes,
  getIsAuthenticated,
  getAuthenticatedUserName,
  getVotingPower,
  getRewardFund,
  getVotePercent,
  getRewriteLinks,
} from '../reducers';
import CommentsList from '../components/Comments/Comments';
import * as commentsActions from './commentsActions';
import { notify } from '../app/Notification/notificationActions';
import './Comments.less';

@connect(
  state => ({
    user: getAuthenticatedUser(state),
    comments: getComments(state),
    commentsList: getCommentsList(state),
    pendingVotes: getCommentsPendingVotes(state),
    authenticated: getIsAuthenticated(state),
    username: getAuthenticatedUserName(state),
    sliderMode: getVotingPower(state),
    rewardFund: getRewardFund(state),
    defaultVotePercent: getVotePercent(state),
    rewriteLinks: getRewriteLinks(state),
  }),
  dispatch =>
    bindActionCreators(
      {
        getComments: commentsActions.getComments,
        voteComment: (id, percent, vote) => commentsActions.likeComment(id, percent, vote),
        sendComment: (parentPost, body, isUpdating, originalPost) =>
          commentsActions.sendComment(parentPost, body, isUpdating, originalPost),
        notify,
      },
      dispatch,
    ),
)
export default class Comments extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    user: PropTypes.shape().isRequired,
    rewardFund: PropTypes.shape().isRequired,
    defaultVotePercent: PropTypes.number.isRequired,
    rewriteLinks: PropTypes.bool.isRequired,
    sliderMode: PropTypes.oneOf(['on', 'off', 'auto']),
    username: PropTypes.string,
    post: PropTypes.shape(),
    comments: PropTypes.shape(),
    commentsList: PropTypes.shape(),
    pendingVotes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        percent: PropTypes.number,
      }),
    ),
    show: PropTypes.bool,
    notify: PropTypes.func,
    getComments: PropTypes.func,
    voteComment: PropTypes.func,
    sendComment: PropTypes.func,
  };

  static defaultProps = {
    username: undefined,
    sliderMode: 'auto',
    post: {},
    comments: {},
    commentsList: {},
    pendingVotes: [],
    show: false,
    notify: () => {},
    getComments: () => {},
    voteComment: () => {},
    sendComment: () => {},
  };

  state = {
    sortOrder: 'trending',
  };

  componentDidMount() {
    if (this.props.show) {
      this.props.getComments(this.props.post.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { post, show } = this.props;

    if (nextProps.show && (nextProps.post.id !== post.id || !show)) {
      this.props.getComments(nextProps.post.id);
    }
  }

  getNestedComments = (commentsObj, commentsIdArray, nestedComments) => {
    const newNestedComments = nestedComments;
    commentsIdArray.forEach(commentId => {
      const nestedCommentArray = commentsObj.childrenById[commentId];
      if (nestedCommentArray.length) {
        newNestedComments[commentId] = nestedCommentArray.map(id => commentsObj.comments[id]);
        this.getNestedComments(commentsObj, nestedCommentArray, newNestedComments);
      }
    });
    return newNestedComments;
  };

  handleLikeClick = (id, weight = 10000) => {
    const { commentsList, sliderMode, user, defaultVotePercent } = this.props;
    const userVote = find(commentsList[id].active_votes, { voter: user.name }) || {};

    if (sliderMode === 'on' || (sliderMode === 'auto' && getHasDefaultSlider(user))) {
      this.props.voteComment(id, weight, 'like');
    } else if (userVote.percent > 0) {
      this.props.voteComment(id, 0, 'like');
    } else {
      this.props.voteComment(id, defaultVotePercent, 'like');
    }
  };

  handleDislikeClick = id => {
    const { commentsList, pendingVotes, user } = this.props;
    if (pendingVotes[id]) return;

    const userVote = find(commentsList[id].active_votes, { voter: user.name }) || {};

    if (userVote.percent < 0) {
      this.props.voteComment(id, 0, 'dislike');
    } else {
      this.props.voteComment(id, -10000, 'dislike');
    }
  };

  render() {
    const {
      user,
      post,
      comments,
      pendingVotes,
      show,
      sliderMode,
      rewardFund,
      defaultVotePercent,
      rewriteLinks,
    } = this.props;
    const postId = post.id;
    let fetchedCommentsList = [];

    const rootNode = comments.childrenById[postId];

    if (rootNode instanceof Array) {
      fetchedCommentsList = rootNode.map(id => comments.comments[id]);
    }

    let commentsChildren = {};

    if (fetchedCommentsList && fetchedCommentsList.length) {
      commentsChildren = this.getNestedComments(comments, comments.childrenById[postId], {});
    }

    return (
      fetchedCommentsList && (
        <CommentsList
          user={user}
          parentPost={post}
          comments={fetchedCommentsList}
          authenticated={this.props.authenticated}
          username={this.props.username}
          commentsChildren={commentsChildren}
          pendingVotes={pendingVotes}
          loading={comments.isFetching}
          show={show}
          notify={this.props.notify}
          rewardFund={rewardFund}
          sliderMode={sliderMode}
          defaultVotePercent={defaultVotePercent}
          rewriteLinks={rewriteLinks}
          onLikeClick={this.handleLikeClick}
          onDislikeClick={this.handleDislikeClick}
          onSendComment={this.props.sendComment}
        />
      )
    );
  }
}
