import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import numeral from 'numeral';
import { Link } from 'react-router-dom';
import { FormattedRelative, FormattedDate, FormattedTime } from 'react-intl';
import { Tabs, Tag, Tooltip, Modal } from 'antd';
import { formatter } from 'steem';
import { getUpvotes, getDownvotes } from '../../helpers/voteHelpers';
import ReactionsList from '../ReactionsList/ReactionsList';
import CommentForm from './CommentForm';
import PayoutDetail from '../PayoutDetail';
import Avatar from '../Avatar';
import Body from '../Story/Body';
import './Comment.less';

class Comment extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    username: PropTypes.string,
    comment: PropTypes.shape().isRequired,
    rootPostAuthor: PropTypes.string,
    commentsChildren: PropTypes.shape(),
    onLikeClick: PropTypes.func,
    onDislikeClick: PropTypes.func,
    onSendComment: PropTypes.func,
  };

  static defaultProps = {
    username: undefined,
    rootPostAuthor: undefined,
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
      reactionsModalVisible: false,
    };
  }

  handleShowReactions = () => this.setState({
    reactionsModalVisible: true,
  });

  handleCloseReactions = () => this.setState({
    reactionsModalVisible: false,
  })

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
    const { authenticated, username } = this.props;
    if (!authenticated) return;

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
    const {
      authenticated,
      username,
      comment,
      rootPostAuthor,
      commentsChildren,
      onLikeClick,
      onDislikeClick,
    } = this.props;

    const pendingPayoutValue = parseFloat(comment.pending_payout_value);
    const totalPayoutValue = parseFloat(comment.total_payout_value);
    const payoutValue = numeral(totalPayoutValue || pendingPayoutValue).format('$0,0.000');

    const upVotes = getUpvotes(comment.active_votes);
    const downVotes = getDownvotes(comment.active_votes);

    const likesValue = numeral(upVotes.length).format(
      '0,0',
    );
    const dislikesValue = numeral(downVotes.length).format(
      '0,0',
    );

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
            <Tooltip title="Reputation score">
              <Tag>
                {formatter.reputation(comment.author_reputation)}
              </Tag>
            </Tooltip>
            {(comment.author === rootPostAuthor) &&
              <Tooltip title="Original poster">
                <Tag color="#4f545c">OP</Tag>
              </Tooltip>
            }
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
            <Tooltip title="Like">
              <a
                role="presentation"
                className="Comment__footer__link"
                onClick={() => onLikeClick(comment.id)}
              >
                <i className="iconfont icon-praise_fill" />
              </a>
            </Tooltip>
            <span
              className="Comment__footer__count"
              role="presentation"
              onClick={this.handleShowReactions}
            >
              {likesValue}
            </span>
            <Tooltip title="Dislike">
              <a
                role="presentation"
                className="Comment__footer__link"
                onClick={() => onDislikeClick(comment.id)}
              >
                <i className="iconfont icon-praise_fill Comment__icon_dislike" />
              </a>
            </Tooltip>
            <span
              className="Comment__footer__count"
              role="presentation"
              onClick={this.handleShowReactions}
            >
              {dislikesValue}
            </span>
            <span className="Comment__footer__bullet" />
            <span className="Comment__footer__payout">
              <Tooltip title={<PayoutDetail post={comment} />}>
                {payoutValue}
              </Tooltip>
            </span>
            {authenticated &&
              <span>
                <span className="Comment__footer__bullet" />
                <a
                  role="presentation"
                  className={classNames('Comment__footer__link', {
                    'Comment__footer__link--active': this.state.replyOpen,
                  })}
                  onClick={() => this.handleReplyClick()}
                >
                  Reply
                </a>
              </span>}
          </div><Modal
            visible={this.state.reactionsModalVisible}
            onOk={this.handleCloseReactions}
            onCancel={this.handleCloseReactions}
          >
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane
                tab={
                  <span>
                    <i className="iconfont icon-praise_fill" />
                    <span className="StoryFooter__icon-text">{likesValue}</span>
                  </span>
                }
                key="1"
              >
                <ReactionsList users={upVotes.map(vote => vote.voter)} />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={
                  <span>
                    <i className="iconfont icon-praise_fill StoryFooter__dislike" />
                    <span className="StoryFooter__icon-text StoryFooter__icon-text-dislike">{dislikesValue}</span>
                  </span>
                }
                key="2"
              >
                <ReactionsList users={downVotes.map(vote => vote.voter)} />
              </Tabs.TabPane>
            </Tabs>
          </Modal>
          {this.state.replyOpen &&
            authenticated &&
            <CommentForm
              username={username}
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
                  key={child.id}
                  authenticated={authenticated}
                  username={username}
                  comment={child}
                  rootPostAuthor={rootPostAuthor}
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
