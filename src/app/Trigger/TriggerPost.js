import React from 'react';
import numeral from 'numeral';
import Icon from '../../widgets/Icon';

const TriggerPost = ({
  reblog,
  isReblogged,
  openCommentingDraft,
  isPostLiked,
  likePost,
  unlikePost,
  content
}) => {

  const payout = numeral(
    parseFloat(content.total_payout_value) +
    parseFloat(content.total_pending_payout_value)
  ).format('$0,0.00');

  const numberOfComments = numeral(content.children).format('0,0');
  const numberOfVotes = numeral(content.net_votes).format('0,0');

  return (
    <div className="actions">
      <div className="triggers">
        <a
          className={isPostLiked ? 'trigger active' : 'trigger'}
          onClick={isPostLiked ? unlikePost : likePost}
        >
          <Icon name="thumb_up" />
        </a>
        { ' ' }
        { numberOfVotes }
        { ' Likes' }

        <Icon name="attach_money" />
        { ' ' }
        { payout }

        <a
          className="trigger"
          onClick={e => {
            e.stopPropagation();
            openCommentingDraft();
          }}
        >
          <Icon name="reply" />
        </a>
        { ' ' }
        { numberOfComments }
        { ' Comments' }
        <a
          className={isReblogged ? 'trigger active' : 'trigger'}
          onClick={reblog}
        >
          <Icon name="repeat" />
        </a>
      </div>
    </div>
  );
};

export default TriggerPost;
