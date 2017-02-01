import React from 'react';
import numeral from 'numeral';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { Tooltip } from 'pui-react-tooltip';
import { OverlayTrigger } from 'pui-react-overlay-trigger';
import { getUpvotes, getDownvotes, sortVotes } from '../../helpers/voteHelpers';
import Icon from '../../widgets/Icon';
import './MenuPost.scss';

const MenuPost = ({
  reblog,
  isReblogged,
  openCommentingDraft,
  isPostLiked,
  isPostDisliked,
  likePost,
  unlikePost,
  dislikePost,
  content,
  isScrolling,
}) => {
  const payout = numeral(
    parseFloat(content.total_payout_value) +
    parseFloat(content.total_pending_payout_value)
  ).format('$0,0.00');
  const numberOfComments = numeral(content.children).format('0,0');
  const numberOfLikes = numeral(content.active_votes.filter(vote => vote.percent > 0).length).format('0,0');
  const numberOfDislikes = numeral(content.active_votes.filter(vote => vote.percent < 0).length).format('0,0');
  const upvotes = sortVotes(getUpvotes(content.active_votes), 'rshares')
    .reverse()
    .slice(0, 5);
  const downvotes = sortVotes(getDownvotes(content.active_votes), 'rshares')
    .reverse()
    .slice(0, 5);

  return (
    <div className="secondary-nav">
      <ul
        className="container text-left"
        style={isScrolling ? { display: 'none' } : {}}
      >
        <li>
          <a
            className={isPostLiked ? 'active' : ''}
            onClick={isPostLiked ? unlikePost : likePost}
          >
            <Icon name="thumb_up" />
          </a>
          {' '}
          <OverlayTrigger
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
          <span className="hidden-xs">
            {' '}<FormattedMessage id="likes" />
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
          <OverlayTrigger
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
          <span className="hidden-xs">
            {' '}<FormattedMessage id="dislikes" />
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
            {' '}<FormattedMessage id="comments" />
          </span>
        </li>
        <li>
          <a
            className={isReblogged ? 'active' : ''}
            onClick={reblog}
          >
            <Icon name="repeat" />
          </a>
        </li>
      </ul>
    </div>
  );
}

export default MenuPost;
