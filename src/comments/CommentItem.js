import React, { Component } from 'react';
import { Link } from 'react-router';
import numeral from 'numeral';
import BodyShort from '../post/BodyShort';
import Avatar from '../widgets/Avatar';
import Icon from '../widgets/Icon';
import { sortCommentsFromSteem } from '../helpers/stateHelpers';

import './CommentItem.scss';

const renderOptimisticComment = (comment) => {
  return (
    <div className="CommentItem">
      <div className={`CommentItem__content CommentItem__content--level-${comment.depth}`}>
        <div className="CommentUser">
          <Link to={`/@${comment.author}`}>
            <Avatar xs username={comment.author} />
          </Link>
        </div>
        <div className="CommentBody">
          <span className="CommentBody__username">
            <Link to={`/@${comment.author}`}>
              @{ comment.author }
            </Link>
          </span>
          <BodyShort body={comment.body} />
        </div>
      </div>
    </div>
  );
};

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
    const { comment, likeComment, unlikeComment, auth, allComments, sortOrder } = this.props;

    if (comment.isOptimistic) {
      return renderOptimisticComment(comment);
    }

    const payout =
      parseFloat(comment.total_payout_value) +
      parseFloat(comment.total_pending_payout_value);

    const isCommentLiked =
      auth.isAuthenticated &&
      comment.active_votes.some(vote => vote.voter === auth.user.name && vote.percent > 0);

    return (
      <div className="CommentItem">
        <div className={`CommentItem__content CommentItem__content--level-${comment.depth}`}>
          <div className="CommentUser">
            <Link to={`/@${comment.author}`}>
              <Avatar xs username={comment.author} />
            </Link>
          </div>
          <div className="CommentBody">
            <span className="CommentBody__username">
              <Link to={`/@${comment.author}`}>
                @{ comment.author }
              </Link>
            </span>
            <BodyShort body={comment.body} />
            <div className="CommentActionButtons">
              <div className="CommentActionButtons__button">
                <a
                  onClick={isCommentLiked
                    ? () => unlikeComment(comment.id)
                    : () => likeComment(comment.id)}
                  className={isCommentLiked ? 'active' : ''}
                >
                  <Icon name="thumb_up" xs />
                </a>{ ' ' }
                { numeral(comment.net_votes).format('0,0') }
              </div>
              <div className="CommentActionButtons__button">
                { numeral(payout).format('$0,0.000') }
              </div>

              <a onClick={(e) => this.handleReplyClick(e)}>
                <Icon name="reply" xs />
              </a>

              { ' ' }

              { (comment.children > 0 && !this.state.showReplies) &&
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

