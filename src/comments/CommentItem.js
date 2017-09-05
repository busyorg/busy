import React, { Component } from 'react';
import { Link, withRouter } from 'react-router';
import { FormattedRelative } from 'react-intl';
import numeral from 'numeral';
import _ from 'lodash';
import Slider from 'rc-slider';
import { SimpleTooltipOrigin } from '../widgets/tooltip/SimpleTooltip';
import { getUpvotes, getDownvotes, sortVotes } from '../helpers/voteHelpers';
import Body from '../post/Body';
import Avatar from '../widgets/Avatar';
import Icon from '../widgets/Icon';
import { sortCommentsFromSteem } from '../helpers/stateHelpers';
import { ProfileTooltipOrigin } from '../widgets/tooltip/ProfileTooltip';
import CommentFormEmbedded from './CommentFormEmbedded';
import './CommentItem.scss';

let timeout;

@withRouter
export default class CommentItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showReplies: props.isSinglePage,
      showEmbeddedComment: false,
      isEditing: false,
      showingVoteBar: false,
      votePower: this.props.votePower
    };
  }

  componentDidMount() {
    this.checkHashLink();
  }

  componentWillReceiveProps(nextProps) {
    this.setState(() => ({ votePower: nextProps.votePower }));
  }

  checkHashLink() {
    const { location } = this.props;
    // eslint-disable-next-line
    if (window && location.hash) {
      this.scrollToAnchoredLink();
    }
  }

  updateCommentPostion = () => {
    // should happen after react-router updated the route
    setTimeout(() => this.checkHashLink());
  }

  scrollToAnchoredLink() {
    const { location } = this.props;
    // eslint-disable-next-line
    const targetElm = window.document.getElementById(location.hash);
    if (!targetElm) return;
    targetElm.scrollIntoView();
  }

  toggleShowReplies = (e) => {
    this.setState({ showReplies: !this.state.showReplies });
  };

  handleReplyClick(e) {
    e.stopPropagation();
    const { comment, isSinglePage } = this.props;

    if (isSinglePage) {
      this.setState({ showEmbeddedComment: !this.state.showEmbeddedComment });
      return;
    }

    this.props.openCommentingDraft({
      parentAuthor: comment.author,
      parentPermlink: comment.permlink,
      category: comment.category,
      id: comment.id,
      isReplyToComment: true,
    });
  }

  handleEditClick(e) {
    e.stopPropagation();
    const { comment, isSinglePage } = this.props;

    if (isSinglePage) {
      this.setState({
        showEmbeddedComment: !this.state.showEmbeddedComment,
        isEditing: true,
      });
      return;
    }

    this.props.openCommentingDraft({
      parentAuthor: comment.parent_author,
      category: comment.category,
      permlink: comment.permlink,
      parentPermlink: comment.parent_permlink,
      id: comment.id,
      isReplyToComment: true,
      isEditing: true,
      body: comment.body
    });
  }

  showVoteBar = () => {
    this.setState(() => ({ showingVoteBar: true }));
  }

  hideVoteBar = () => {
    this.setState(() => ({ showingVoteBar: false }));
  }

  handleVoteChange = (val) => {
    this.setState(() => ({ votePower: val }), () => {
      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(() => {
        this.props.updateVotePowerBar(val);
      }, 1000);
    });
  }

  render() {
    const { comment, likeComment, unlikeComment, dislikeComment, auth, allComments, sortOrder } = this.props;

    const pendingPayoutValue = parseFloat(comment.pending_payout_value);
    const totalPayoutValue = parseFloat(comment.total_payout_value);
    const payout = totalPayoutValue || pendingPayoutValue;

    const isCommentLiked =
      auth.isAuthenticated &&
      comment.active_votes.some(vote => vote.voter === auth.user.name && vote.percent > 0);

    const isCommentDisliked =
      auth.isAuthenticated &&
      comment.active_votes.some(vote => vote.voter === auth.user.name && vote.percent < 0);

    const isEditable = _.has(auth, 'user.name') ? comment.author === auth.user.name : false;
    const numberOfLikes = numeral(comment.active_votes.filter(vote => vote.percent > 0).length).format('0,0');
    const numberOfDislikes = numeral(comment.active_votes.filter(vote => vote.percent < 0).length).format('0,0');

    const fiveLastUpvotes =
      sortVotes(getUpvotes(comment.active_votes), 'rshares')
        .reverse()
        .slice(0, 5);
    const likesTooltipMsg = fiveLastUpvotes.map(vote => `${vote.voter}\n`);
    if (likesTooltipMsg.length === 5) likesTooltipMsg.push('...');

    const fiveLastDownvotes =
      sortVotes(getDownvotes(comment.active_votes), 'rshares')
      .reverse()
      .slice(0, 5);
    const dislikesTooltipMsg = fiveLastDownvotes.map(vote => `${vote.voter}\n`);
    if (dislikesTooltipMsg.length === 5) dislikesTooltipMsg.push('...');

    const anchoredLink = `#@${comment.author}/${comment.permlink}`;

    return (
      <div
        className={
          anchoredLink === this.props.location.hash
            ? 'CommentItem CommentItem--highlight'
            : 'CommentItem'
        }
        id={anchoredLink}
      >
        <div className={`CommentItem__content CommentItem__content--level-${comment.depth}`}>
          <div className="CommentUser">
            <ProfileTooltipOrigin username={comment.author} >
              <Link to={`/@${comment.author}`}>
                <Avatar
                  className={this.props.isSinglePage ? 'Avatar--md' : 'Avatar--xs'}
                  username={comment.author}
                />
              </Link>
            </ProfileTooltipOrigin>
          </div>
          <div className="CommentBody">
            <span className="CommentBody__username">
              <ProfileTooltipOrigin username={comment.author}>
                <Link to={`/@${comment.author}`}>
                  {comment.author}
                </Link>
              </ProfileTooltipOrigin>
              {' '}
              <Link className="text-info" to={comment.url} onClick={this.updateCommentPostion}>
                <FormattedRelative value={`${comment.created}Z`} />
              </Link>
            </span>
            <Body body={comment.body} />
            <div className="CommentActionButtons">
              <div className="CommentActionButtons__button">
                <div className="LikeBar--container Likebar--single-comment" onMouseLeave={this.hideVoteBar}>
                  {!isCommentLiked && this.state.showingVoteBar && this.props.voteBarEnabled &&
                    <div className="LikeBar">
                      <span className="LikeBar--text">Power: {this.state.votePower}%</span>
                      <Slider
                        defaultValue={this.state.votePower} min={1} tipTransitionName="rc-slider-tooltip-zoom-down"
                        onChange={this.handleVoteChange}
                      />
                      </div>}
                    <a
                      onClick={isCommentLiked
                      ? () => unlikeComment(comment.id)
                      : () => likeComment(comment.id, this.state.votePower * 100)}
                      className={isCommentLiked ? 'active' : ''}
                      onMouseEnter={this.showVoteBar}
                      >
                      <Icon name="thumb_up" xs />
                    </a>
                </div>
                {' '}
                {fiveLastUpvotes.length > 0 ?
                  <SimpleTooltipOrigin message={likesTooltipMsg}>
                    <a>{numberOfLikes}</a>
                  </SimpleTooltipOrigin>
                  :
                  numberOfLikes
                }
              </div>

              <div className="CommentActionButtons__button">
                <a
                  onClick={isCommentDisliked
                    ? () => unlikeComment(comment.id)
                    : () => dislikeComment(comment.id)}
                  className={isCommentDisliked ? 'active' : ''}
                >
                  <Icon name="thumb_down" xs />
                </a>
                {' '}
                {fiveLastDownvotes.length > 0 ?
                  <SimpleTooltipOrigin message={dislikesTooltipMsg}>
                    <a>{numberOfDislikes}</a>
                  </SimpleTooltipOrigin>
                  :
                  numberOfDislikes
                }
              </div>

              <div className="CommentActionButtons__button">
                {numeral(payout).format('$0,0.000')}
              </div>

              {isEditable && <div className="CommentActionButtons__button">
                <a onClick={e => this.handleEditClick(e)}>
                  <Icon name="edit" xs />
                </a>
              </div>}

              <a onClick={e => this.handleReplyClick(e)}>
                <Icon name="reply" xs />
              </a>

              {' '}

              {(comment.children > 0 && !this.state.showReplies) &&
                <a tabIndex="0" onClick={this.toggleShowReplies}>
                  View {comment.children}{' '}
                  {comment.children > 1 ? 'replies' : 'reply'}
                </a>
              }
            </div>

            {this.state.showEmbeddedComment &&
              <CommentFormEmbedded
                parentId={comment.id}
                isReplyToComment
                isEditing={this.state.isEditing}
                onSubmit={() => this.setState({ showEmbeddedComment: false, isEditing: false })}
              />
            }

          </div>
        </div>
        {this.state.showReplies && allComments.listByCommentId[comment.id] &&
          sortCommentsFromSteem(
            allComments.listByCommentId[comment.id],
            allComments,
            sortOrder
          ).map(commentId =>
            <CommentItem
              {...this.props}
              key={commentId}
              comment={allComments.comments[commentId]}
            />
            )
        }
      </div>
    );
  }
}

