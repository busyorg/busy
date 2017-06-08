import React, { PropTypes } from 'react';
import numeral from 'numeral';
import _ from 'lodash';
import { FormattedRelative } from 'react-intl';
import { Tooltip } from 'antd';
import { calculatePayout } from '../../helpers/steemitHelpers';
import './StoryFooter.less';

const AmountWithLabel = ({ label, amount }) => (
  _.isNumber(amount)
    ? <div>{label}: {numeral(amount).format('$0,0.00')}</div>
    : null
);

const PayoutDetail = ({ post }) => {
  const {
    payoutLimitHit,
    potentialPayout,
    promotionCost,
    cashoutInTime,
    isPayoutDeclined,
    maxAcceptedPayout,
    pastPayouts,
    authorPayouts,
    curatorPayouts,
  } = calculatePayout(post);

  return (<div>
    {payoutLimitHit && <div>Payout limit reached on this post</div>}
    <AmountWithLabel label="Potential Payout" amount={potentialPayout} />
    <AmountWithLabel label="Promoted" amount={promotionCost} />
    {!isPayoutDeclined && cashoutInTime &&
      <div>Will release <FormattedRelative value={cashoutInTime} /></div>}
    {isPayoutDeclined && <div>Declined Payout</div>}
    <AmountWithLabel label="Max Accepted Payout" amount={maxAcceptedPayout} />
    <AmountWithLabel label="Total Past Payouts" amount={pastPayouts} />
    <AmountWithLabel label="Authors Payout" amount={authorPayouts} />
    <AmountWithLabel label="Curators Payout" amount={curatorPayouts} />
  </div>);
};

const StoryFooter = ({ post, onLikeClick, onDislikeClick, onCommentClick, onShareClick }) => {
  const payout = parseFloat(post.pending_payout_value) || parseFloat(post.total_payout_value);
  const payoutValue = numeral(payout).format('$0,0.00');
  const likesValue = numeral(post.active_votes.filter(vote => vote.percent > 0).length).format('0,0');
  const dislikesValue = numeral(post.active_votes.filter(vote => vote.percent < 0).length).format('0,0');
  const commentsValue = numeral(post.children).format('0,0');

  return (<div className="StoryFooter">
    <span className="StoryFooter__payout">
      <Tooltip
        title={<PayoutDetail post={post} />}
        placement="bottom"
      >
        {payoutValue}
      </Tooltip>
    </span>
    <Tooltip
      title="Like"
      placement="bottom"
    >
      <a className="StoryFooter__link" onClick={() => onLikeClick()}>
        <i className="iconfont icon-praise_fill" />
        <span className="StoryFooter__number">{likesValue}</span>
      </a>
    </Tooltip>
    <Tooltip
      title="Dislike"
      placement="bottom"
    >
    <a className="StoryFooter__link" onClick={() => onDislikeClick()}>
      <i className="iconfont icon-praise_fill StoryFooter__dislike" />
      <span className="StoryFooter__number">{dislikesValue}</span>
    </a>
    </Tooltip>
    <Tooltip
      title="Comment"
      placement="bottom"
    >
    <a className="StoryFooter__link" onClick={() => onCommentClick()}>
      <i className="iconfont icon-message_fill" />
      <span className="StoryFooter__number">{commentsValue}</span>
    </a>
    </Tooltip>
    <Tooltip
      title="Reblog"
      placement="bottom"
    >
    <a className="StoryFooter__link" onClick={() => onShareClick()}>
      <i className="iconfont icon-send StoryFooter__share" />
    </a>
    </Tooltip>
  </div>);
};

StoryFooter.propTypes = {
  post: PropTypes.shape(),
};

export default StoryFooter;
