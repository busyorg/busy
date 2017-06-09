import React, { PropTypes } from 'react';
import numeral from 'numeral';
import { Link } from 'react-router';
import { FormattedRelative, FormattedDate, FormattedTime } from 'react-intl';
import { Tooltip } from 'antd';
import Avatar from '../Avatar';
import './Comment.less';

const Comment = ({ comment, commentsChildren }) => {
  const pendingPayoutValue = parseFloat(comment.pending_payout_value);
  const totalPayoutValue = parseFloat(comment.total_payout_value);
  const payoutValue = numeral(totalPayoutValue || pendingPayoutValue).format('$0,0.000');

  const likesValue = numeral(comment.active_votes.filter(vote => vote.percent > 0).length).format('0,0');
  const dislikesValue = numeral(comment.active_votes.filter(vote => vote.percent < 0).length).format('0,0');

  return (
    <div className="Comment">
      <Avatar username={comment.author} size={40} />
      <div className="Comment__text">
        <Link to={`/@${comment.author}`}>
          {comment.author}
        </Link>
        <span className="Comment__date">
          <Tooltip
            title={
              <span>
                <FormattedDate value={`${comment.created}Z`} />
                {' '}
                <FormattedTime value={`${comment.created}Z`} />
              </span>
            }
          >
            <Link to={comment.permalink}>
              <FormattedRelative value={`${comment.created}Z`} />
            </Link>
          </Tooltip>
        </span>
        <div className="Comment__content">
          {comment.body}
        </div>
        <div className="Comment__footer">
          <Tooltip title="Like" placement="bottom">
            <a className="Comment__footer__link">
              <i className="iconfont icon-praise_fill" />
              {likesValue}
            </a>
          </Tooltip>
          <Tooltip title="Dislike" placement="bottom">
            <a className="Comment__footer__link">
              <i className="iconfont icon-praise_fill Comment__icon_dislike" />
              {dislikesValue}
            </a>
          </Tooltip>
          <span className="Comment__footer__bullet" />
          <span className="Comment__footer__payout">{payoutValue}</span>
        </div>
        <div className="Comment__replies">
          {
            commentsChildren &&
            commentsChildren[comment.id] &&
            commentsChildren[comment.id]
              .map(child => <Comment comment={child} commentsChildren={commentsChildren} />)
          }
        </div>
      </div>
    </div>);
};

Comment.propTypes = {
  comment: PropTypes.shape(),
  commentsChildren: PropTypes.shape(),
};

export default Comment;

