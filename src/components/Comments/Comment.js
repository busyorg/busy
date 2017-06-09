import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { FormattedRelative } from 'react-intl';
import { Tooltip } from 'antd';
import Avatar from '../Avatar';
import './Comment.less';

const Comment = () =>
  <div className="Comment">
    <Avatar username="guest123" size={40} />
    <div className="Comment__text">
      <Link to="guest123">
        guest123
      </Link>
      <span className="Comment__date">
        <FormattedRelative value="2017-06-06T13:46:37Z" />
      </span>
      <div className="Comment__content">
        Add the ability to raise and track funds directly through SteemPoll leveraging Steem’s escrow (multi-signature) features, establish fundraising deadlines, and returning of funds to donors in the event the minimum is not reached
        Please discuss this option below via comments.
        You can see results on www.steempoll.net
      </div>
      <div className="Comment__footer">
        <Tooltip title="Like" placement="bottom">
          <a className="Comment__footer__link">
            <i className="iconfont icon-praise_fill" />
            <span className="Comment__footer__link__number">55</span>
          </a>
        </Tooltip>
        <Tooltip title="Dislike" placement="bottom">
          <a className="Comment__footer__link">
            <i className="iconfont icon-praise_fill Comments__icon_dislike" />
            <span className="Comment__footer__link__number">55</span>
          </a>
        </Tooltip>
        <span className="Comment__footer__bullet" />
        <span className="Comment__footer__payout">$51.22</span>
      </div>
    </div>
  </div>;

export default Comment;

