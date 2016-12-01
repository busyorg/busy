import React, { Component } from 'react';
import { Link } from 'react-router';
import numeral from 'numeral';
import BodyShort from '../post/body-short';
import Avatar from '../widgets/Avatar';
import Icon from '../widgets/Icon';

import './CommentItem.scss';

const renderOptimisticComment = (comment) => {
  return (
    <div className="CommentItem">
      <Link to={`/@${comment.author}`}>
        <Avatar xs username={comment.author} /> @{ comment.author }
      </Link>
      { ' ' }
      <b>$0.00</b>
      { ' ' }
      <BodyShort body={comment.body} />
    </div>
  );
};

export default class CommentItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showReplies: false,
    };
  }

  toggleShowReplies = (e) => {
    this.setState({ showReplies: !this.state.showReplies });
  };

  render() {
    const { comment, likeComment, unlikeComment, auth } = this.props;

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
                </a>
              </div>
              <div className="CommentActionButtons__button">
                { numeral(comment.net_votes).format('0,0') }
              </div>
              <div className="CommentActionButtons__button">
                ${ payout }
              </div>
              { (comment.children > 0 && !this.state.showReplies) &&
              <a tabIndex="0" onClick={this.toggleShowReplies}>
                <Icon name="reply" xs />View {comment.children}{' '}
                {comment.children > 1 ? 'replies' : 'reply'}
              </a>
              }
            </div>
          </div>
        </div>
        { this.state.showReplies && this.props.children }
      </div>
    );
  }
};

