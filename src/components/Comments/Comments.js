import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import { FormattedRelative } from 'react-intl';
import { Tooltip } from 'antd';
import Avatar from '../Avatar';
import './Comments.less';

class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sort: 'BEST',
    };
  }

  handleSortClick = (e) => {
    const type = e.target.dataset.type;
    if (type) {
      this.setState({
        sort: type,
      });
    }
  };

  render() {
    return (
      <div className="Comments">
        <div className="Comments__sort" onClick={this.handleSortClick}>
          <a className={classNames({ active: this.state.sort === 'BEST' })} data-type="BEST">Best</a>
          <a className={classNames({ active: this.state.sort === 'TRENDING' })} data-type="TRENDING">Trending</a>
          <a className={classNames({ active: this.state.sort === 'NEWEST' })} data-type="NEWEST">Newest</a>
        </div>
        <div className="Comments__comment">
          <Avatar username="guest123" size={40} />
          <div className="Comments__comment__text">
            <Link to="guest123">
              guest123
            </Link>
            <span className="Comments__comment__date">
              <FormattedRelative value="2017-06-06T13:46:37Z" />
            </span>
            <div className="Comments__comment__content">
              Add the ability to raise and track funds directly through SteemPoll leveraging Steem’s escrow (multi-signature) features, establish fundraising deadlines, and returning of funds to donors in the event the minimum is not reached
              Please discuss this option below via comments.
              You can see results on www.steempoll.net
            </div>
            <div className="Comments__comment__footer">
              <Tooltip title="Like" placement="bottom">
                <a className="Comments__comment__footer__link">
                  <i className="iconfont icon-praise_fill" />
                  <span className="Comments__comment__footer__link__number">55</span>
                </a>
              </Tooltip>
              <Tooltip title="Dislike" placement="bottom">
                <a className="Comments__comment__footer__link">
                  <i className="iconfont icon-praise_fill Comments__icon_dislike" />
                  <span className="Comments__comment__footer__link__number">55</span>
                </a>
              </Tooltip>
              <span className="Comments__comment__footer__bullet" />
              <span className="Comments__comment__footer__payout">$51.22</span>
            </div>
          </div>
        </div>
      </div>);
  }
}

export default Comments;
