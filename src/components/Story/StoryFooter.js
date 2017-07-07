import React, { PropTypes } from 'react';
import numeral from 'numeral';
import { Tooltip } from 'antd';
import classNames from 'classnames';

import PayoutDetail from '../PayoutDetail';
import './StoryFooter.less';

const StoryFooter = ({ post, postState, onLikeClick, onCommentClick, onShareClick }) => {
  const maxPayout = parseFloat(post.max_accepted_payout) || 0;
  const payout = parseFloat(post.pending_payout_value) || parseFloat(post.total_payout_value);
  const payoutValue = numeral(payout).format('$0,0.00');
  const likesValue = numeral(post.active_votes.filter(vote => vote.percent > 0).length).format(
    '0,0'
  );
  const commentsValue = numeral(post.children).format('0,0');
  const likeClass = classNames({ active: postState.isLiked, StoryFooter__link: true });
  const rebloggedClass = classNames({ active: postState.isReblogged, StoryFooter__link: true });

  return (
    <div className="StoryFooter">
      <span className={classNames('StoryFooter__payout', { 'StoryFooter__payout--rejected': maxPayout === 0 })}>
        <Tooltip title={<PayoutDetail post={post} />} placement="top">
          {payoutValue}
        </Tooltip>
      </span>
      <Tooltip title="Like" placement="top">
        <a className={likeClass} onClick={() => onLikeClick()}>
          <i className="iconfont icon-praise_fill" />
          <span className="StoryFooter__number">{likesValue}</span>
        </a>
      </Tooltip>
      <Tooltip title="Comment" placement="top">
        <a className="StoryFooter__link" onClick={() => onCommentClick()}>
          <i className="iconfont icon-message_fill" />
          <span className="StoryFooter__number">{commentsValue}</span>
        </a>
      </Tooltip>
      <Tooltip title="Reblog" placement="top">
        <a className={rebloggedClass} onClick={() => onShareClick()}>
          <i className="iconfont icon-send StoryFooter__share" />
        </a>
      </Tooltip>
    </div>
  );
};

StoryFooter.propTypes = {
  post: PropTypes.shape().isRequired,
};

export default StoryFooter;
