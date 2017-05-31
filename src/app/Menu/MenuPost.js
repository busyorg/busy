import React from 'react';
import numeral from 'numeral';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import { SimpleTooltipOrigin } from '../../widgets/tooltip/SimpleTooltip';
import { getUpvotes, getDownvotes, sortVotes } from '../../helpers/voteHelpers';
import Icon from '../../widgets/Icon';
import './MenuPost.less';

const MenuPost = ({
  reblog,
  isReblogged,
  canReblog,
  openCommentingDraft,
  isPostLiked,
  isPostDisliked,
  likePost,
  unlikePost,
  dislikePost,
  content,
  onEdit,
}) => {
  const pendingPayoutValue = parseFloat(content.pending_payout_value);
  const totalPayoutValue = parseFloat(content.total_payout_value);
  let payout = totalPayoutValue || pendingPayoutValue;
  payout = numeral(payout).format('$0,0.00');
  const numberOfComments = numeral(content.children).format('0,0');
  const numberOfLikes = numeral(content.active_votes.filter(vote => vote.percent > 0).length).format('0,0');
  const numberOfDislikes = numeral(content.active_votes.filter(vote => vote.percent < 0).length).format('0,0');

  const fiveLastUpvotes =
    sortVotes(getUpvotes(content.active_votes), 'rshares')
    .reverse()
    .slice(0, 5);
  const likesTooltipMsg = fiveLastUpvotes.map(vote => `${vote.voter}\n`);
  if (likesTooltipMsg.length === 5) likesTooltipMsg.push('...');

  const fiveLastDownvotes =
    sortVotes(getDownvotes(content.active_votes), 'rshares')
    .reverse()
    .slice(0, 5);
  const dislikesTooltipMsg = fiveLastDownvotes.map(vote => `${vote.voter}\n`);
  if (dislikesTooltipMsg.length === 5) dislikesTooltipMsg.push('...');

  return (
    <div className="secondary-nav">
      <ul className="container text-left">
        <li>
          <a
            className={isPostLiked ? 'active' : ''}
            onClick={isPostLiked ? unlikePost : likePost}
          >
            <Icon name="thumb_up" />
          </a>
          {' '}
          <SimpleTooltipOrigin message={likesTooltipMsg}>
            <a>{numberOfLikes}</a>
          </SimpleTooltipOrigin>
          <span className="hidden-xs">
            {' '}<FormattedMessage id="likes" defaultMessage="Likes" />
          </span>
        </li>

        <li>
          <a
            className={isPostDisliked ? 'active' : ''}
            onClick={isPostDisliked ? unlikePost : dislikePost}
          >
            <Icon name="thumb_down" />
          </a>
          {' '}
          <SimpleTooltipOrigin message={dislikesTooltipMsg}>
            <a>{numberOfDislikes}</a>
          </SimpleTooltipOrigin>
          <span className="hidden-xs">
            {' '}<FormattedMessage id="dislikes" defaultMessage="Dislikes" />
          </span>
        </li>

        <li>
          <Icon name="attach_money" />
          {' '}{payout}
        </li>
        <li>
          <a
            onClick={(e) => {
              e.stopPropagation();
              openCommentingDraft();
            }}
          >
            <Icon name="reply" />
          </a>
          {` ${numberOfComments}`}
          <span className="hidden-xs">
            {' '}<FormattedMessage id="comments" defaultMessage="Comments" />
          </span>
        </li>
        {canReblog &&
          <li>
            <a
              className={isReblogged ? 'active' : ''}
              onClick={reblog}
            >
              <Icon name="repeat" />
            </a>
          </li>
        }
        {onEdit &&
          <li>
            <a onClick={onEdit}>
              <Icon name="edit" />
              {' '}<FormattedMessage id="edit" defaultMessage="Edit" />
            </a>
          </li>
        }
        <li>
          <Link
            to={`/transfer?to=${content.author}&amount=50.000&currency=STEEM&memo=Thank you for your post: ${content.title}`}
          >
            <Icon name="favorite" />
            <span className="hidden-xs">
              {' '}
              <FormattedMessage
                id="tip"
                defaultMessage="Tip the author"
              />
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default MenuPost;
