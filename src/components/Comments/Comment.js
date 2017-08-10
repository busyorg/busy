import React, { PropTypes } from 'react';
import classNames from 'classnames';
import numeral from 'numeral';
import { Link } from 'react-router-dom';
import { FormattedRelative, FormattedDate, FormattedTime } from 'react-intl';
import { Tag, Tooltip } from 'antd';
import { formatter } from 'steem';
import CommentForm from './CommentForm';
import PayoutDetail from '../PayoutDetail';
import Avatar from '../Avatar';
import Body from '../Story/Body';
import './Comment.less';

class Comment extends React.Component {
  static propTypes = {
    auth: PropTypes.shape(),
    comment: PropTypes.shape().isRequired,
    commentsChildren: PropTypes.shape(),
    onLikeClick: PropTypes.func,
    onDislikeClick: PropTypes.func,
    onSendComment: PropTypes.func,
  };

  static defaultProps = {
    auth: undefined,
    commentsChildren: undefined,
    onLikeClick: () => {},
    onDislikeClick: () => {},
    onSendComment: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      replyOpen: false,
      collapsed: false,
      showCommentFormLoading: false,
      commentFormText: '',
    };
  }

  handleReplyClick = () => {
    this.setState({
      replyOpen: !this.state.replyOpen,
    });
  };

  handleCollapseClick = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  handleImageInserted = (blob, callback, errorCallback) => {
    const { auth } = this.props;
    const username = auth && auth.user && auth.user.name;
    const formData = new FormData();
    formData.append('files', blob);

    fetch(`https://busy-img.herokuapp.com/@${username}/uploads`, {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(res => callback(res.secure_url, blob.name))
      .catch(() => errorCallback());
  };

  submitComment = (parentPost, commentValue) => {
    this.setState({ showCommentFormLoading: true });

    this.props
      .onSendComment(parentPost, commentValue)
      .then(() => {
        this.setState({
          showCommentFormLoading: false,
          replyOpen: false,
          commentFormText: '',
        });
      })
      .catch(() => {
        this.setState({
          showCommentFormLoading: false,
          replyOpen: true,
          commentFormText: commentValue,
        });
      });
  };

  render() {
    const { auth, comment, commentsChildren, onLikeClick, onDislikeClick } = this.props;

    const pendingPayoutValue = parseFloat(comment.pending_payout_value);
    const totalPayoutValue = parseFloat(comment.total_payout_value);
    const payoutValue = numeral(totalPayoutValue || pendingPayoutValue).format('$0,0.000');

    const likesValue = numeral(comment.active_votes.filter(vote => vote.percent > 0).length).format(
      '0,0',
    );
    const dislikesValue = numeral(
      comment.active_votes.filter(vote => vote.percent < 0).length,
    ).format('0,0');

    return (
      <div className="Comment">
        <span
          role="presentation"
          className="Comment__visibility"
          onClick={() => this.handleCollapseClick()}
        >
          {this.state.collapsed
            ? <i className="iconfont icon-addition" />
            : <i className="iconfont icon-offline" />}
        </span>
        <Avatar username={comment.author} size={comment.depth === 1 ? 40 : 32} />
        <div className="Comment__text">
          <Link to={`/@${comment.author}`}>
            {comment.author}
            <Tag>
              {formatter.reputation(comment.author_reputation)}
            </Tag>
          </Link>
          <span className="Comment__date">
            <Tooltip
              title={
                <span>
                  <FormattedDate value={`${comment.created}Z`} />{' '}
                  <FormattedTime value={`${comment.created}Z`} />
                </span>
              }
            >
              <Link to={comment.permlink}>
                <FormattedRelative value={`${comment.created}Z`} />
              </Link>
            </Tooltip>
          </span>
          <div className="Comment__content">
            {this.state.collapsed
              ? <div className="Comment__content__collapsed">Comment collapsed</div>
              : <Body body={comment.body} />}
          </div>
          <div className="Comment__footer">
            <Tooltip title="Like" placement="bottom">
              <a
                role="presentation"
                className="Comment__footer__link"
                onClick={() => onLikeClick(comment.id)}
              >
                <i className="iconfont icon-praise_fill" />
                {likesValue}
              </a>
            </Tooltip>
            <Tooltip title="Dislike" placement="bottom">
              <a
                role="presentation"
                className="Comment__footer__link"
                onClick={() => onDislikeClick(comment.id)}
              >
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
            {auth &&
              auth.isAuthenticated &&
              <a
                role="presentation"
                className={classNames('Comment__footer__link', {
                  'Comment__footer__link--active': this.state.replyOpen,
                })}
                onClick={() => this.handleReplyClick()}
              >
                Reply
              </a>}
          </div>
          {this.state.replyOpen &&
            auth &&
            auth.isAuthenticated &&
            <CommentForm
              username={auth.user.name}
              parentPost={comment}
              isSmall={comment.depth !== 1}
              onSubmit={this.submitComment}
              isLoading={this.state.showCommentFormLoading}
              inputValue={this.state.commentFormText}
              onImageInserted={this.handleImageInserted}
            />}
          <div className="Comment__replies">
            {!this.state.collapsed &&
              commentsChildren &&
              commentsChildren[comment.id] &&
              commentsChildren[comment.id].map(child =>
                (<Comment
                  auth={auth}
                  key={child.id}
                  comment={child}
                  commentsChildren={commentsChildren}
                  onLikeClick={onLikeClick}
                  onDislikeClick={onDislikeClick}
                  onSendComment={this.props.onSendComment}
                />),
              )}
          </div>
        </div>
      </div>
    );
  }
}

export default Comment;
