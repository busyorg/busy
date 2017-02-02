import React, { Component } from 'react';
import { Link } from 'react-router';
import { FormattedRelative } from 'react-intl';
import numeral from 'numeral';
import _ from 'lodash';
import { Tooltip } from 'pui-react-tooltip';
import { OverlayTrigger } from 'pui-react-overlay-trigger';
import { getUpvotes, getDownvotes, sortVotes } from '../helpers/voteHelpers';
import Body from '../post/Body';
import Avatar from '../widgets/Avatar';
import Icon from '../widgets/Icon';
import { sortCommentsFromSteem } from '../helpers/stateHelpers';
import ProfileTooltipOrigin from '../user/profileTooltip/ProfileTooltipOrigin';
import './CommentItem.scss';

const renderOptimisticComment = (comment) =>
  <div className="CommentItem">
    <div className={`CommentItem__content CommentItem__content--level-${comment.depth}`}>
      <div className="CommentUser">
        <ProfileTooltipOrigin username={comment.author}>
          <Link to={`/@${comment.author}`}>
            <Avatar xs username={comment.author} />
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
        </span>
        <Body body={comment.body} />
      </div>
    </div>
  </div>;

export default class CommentItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showReplies: props.isSinglePage,
    };
  }

  toggleShowReplies = (e) => {
    this.setState({ showReplies: !this.state.showReplies });
  };

  handleReplyClick(e) {
    e.stopPropagation();
    const { comment } = this.props;

    this.props.openCommentingDraft({
      parentAuthor: comment.author,
      parentPermlink: comment.permlink,
      category: comment.category,
      id: comment.id,
      isReplyToComment: true,
    });
  }

  render() {
    const { comment, likeComment, unlikeComment, dislikeComment, auth, allComments, sortOrder } = this.props;

    if (comment.isOptimistic) {
      return renderOptimisticComment(comment);
    }

    const payout =
      parseFloat(comment.total_payout_value) +
      parseFloat(comment.total_pending_payout_value);

    const isCommentLiked =
      auth.isAuthenticated &&
      comment.active_votes.some(vote => vote.voter === auth.user.name && vote.percent > 0);

    const isCommentDisliked =
      auth.isAuthenticated &&
      comment.active_votes.some(vote => vote.voter === auth.user.name && vote.percent < 0);

    const numberOfLikes = numeral(comment.active_votes.filter(vote => vote.percent > 0).length).format('0,0');
    const numberOfDislikes = numeral(comment.active_votes.filter(vote => vote.percent < 0).length).format('0,0');
    const upvotes = sortVotes(getUpvotes(comment.active_votes), 'rshares')
      .reverse()
      .slice(0, 5);
    const downvotes = sortVotes(getDownvotes(comment.active_votes), 'rshares')
      .reverse()
      .slice(0, 5);

    return (
      <div className="CommentItem">
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
              <span className="text-info">
                <FormattedRelative value={comment.created} />
              </span>
            </span>
            <Body body={comment.body} />
            <div className="CommentActionButtons">
              <div className="CommentActionButtons__button">
                <a
                  onClick={isCommentLiked
                    ? () => unlikeComment(comment.id)
                    : () => likeComment(comment.id)}
                  className={isCommentLiked ? 'active' : ''}
                >
                  <Icon name="thumb_up" xs />
                </a>
                {' '}
                {upvotes.length > 0
                  ? <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip>
                        {upvotes.map(vote =>
                          <div key={vote.voter}>{vote.voter}</div>
                        )}
                        {_.size(upvotes) === 5 && <div>…</div>}
                      </Tooltip>
                    }
                  >
                    <a>{numberOfLikes}</a>
                  </OverlayTrigger>
                : numberOfLikes
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
                {downvotes.length > 0
                  ? <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip>
                        {downvotes.map(vote =>
                          <div key={vote.voter}>{vote.voter}</div>
                        )}
                        {_.size(downvotes) === 5 && <div>…</div>}
                      </Tooltip>
                    }
                  >
                    <a>{numberOfDislikes}</a>
                  </OverlayTrigger>
                  : numberOfDislikes
                }
              </div>

              <div className="CommentActionButtons__button">
                { numeral(payout).format('$0,0.000') }
              </div>

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
          </div>
        </div>
        { this.state.showReplies && allComments.listByCommentId[comment.id] &&
          sortCommentsFromSteem(
            allComments.listByCommentId[comment.id],
            allComments,
            sortOrder
          ).map(commentId =>
            <CommentItem
              { ...this.props }
              key={commentId}
              comment={allComments.comments[commentId]}
            />
          )
        }
      </div>
    );
  }
};

