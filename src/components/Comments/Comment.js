import React, { PropTypes } from 'react';
import classNames from 'classnames';
import numeral from 'numeral';
import { Link } from 'react-router';
import { FormattedRelative, FormattedDate, FormattedTime } from 'react-intl';
import { Tooltip } from 'antd';
import CommentForm from './CommentForm';
import PayoutDetail from '../PayoutDetail';
import Avatar from '../Avatar';
import './Comment.less';

class Comment extends React.Component {
  static propTypes = {
    comment: PropTypes.shape(),
    commentsChildren: PropTypes.shape(),
    onLikeClick: PropTypes.func,
    onDislikeClick: PropTypes.func,
  };

  static defaultProps = {
    onLikeClick: () => {},
    onDislikeClick: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      replyOpen: false,
    };
  }

  handleReplyClick = () => {
    this.setState({
      replyOpen: !this.state.replyOpen,
    });
  }

  render() {
    const { comment, commentsChildren, onLikeClick, onDislikeClick } = this.props;

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
              <a className="Comment__footer__link" onClick={() => onLikeClick(comment.id)}>
                <i className="iconfont icon-praise_fill" />
                {likesValue}
              </a>
            </Tooltip>
            <Tooltip title="Dislike" placement="bottom">
              <a className="Comment__footer__link" onClick={() => onDislikeClick(comment.id)}>
                <i className="iconfont icon-praise_fill Comment__icon_dislike" />
                {dislikesValue}
              </a>
            </Tooltip>
            <span className="Comment__footer__bullet" />
            <span className="Comment__footer__payout">
              <Tooltip title={<PayoutDetail post={comment} />} placement="bottom">
                {payoutValue}
              </Tooltip>
            </span>
            <span className="Comment__footer__bullet" />
            <a
              className={
                classNames('Comment__footer__link', {
                  'Comment__footer__link--active': this.state.replyOpen,
                })
              }
              onClick={() => this.handleReplyClick()}
            >
              Reply
            </a>
          </div>
          {
            this.state.replyOpen && <CommentForm />
          }
          <div className="Comment__replies">
            {
              commentsChildren &&
              commentsChildren[comment.id] &&
              commentsChildren[comment.id]
                .map(child => <Comment
                  key={child.id}
                  comment={child}
                  commentsChildren={commentsChildren}
                  onLikeClick={onLikeClick}
                  onDislikeClick={onDislikeClick}
                />)
            }
          </div>
        </div>
      </div>);
  }
}

export default Comment;
