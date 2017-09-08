import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { take, find } from 'lodash';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedRelative, FormattedDate, FormattedTime, FormattedNumber, FormattedMessage } from 'react-intl';
import { Icon, Tag, Tooltip } from 'antd';
import { formatter } from 'steem';
import { getUpvotes, getDownvotes } from '../../helpers/voteHelpers';
import { sortComments, sortVotes } from '../../helpers/sortHelpers';
import { calculatePayout } from '../../vendor/steemitHelpers';
import ReactionsModal from '../Reactions/ReactionsModal';
import CommentForm from './CommentForm';
import USDDisplay from '../Utils/USDDisplay';
import PayoutDetail from '../PayoutDetail';
import Avatar from '../Avatar';
import Body from '../Story/Body';
import './Comment.less';

@injectIntl
class Comment extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    authenticated: PropTypes.bool.isRequired,
    username: PropTypes.string,
    comment: PropTypes.shape().isRequired,
    sort: PropTypes.oneOf(['BEST', 'NEWEST', 'OLDEST']),
    rootPostAuthor: PropTypes.string,
    commentsChildren: PropTypes.shape(),
    pendingVotes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      percent: PropTypes.number,
    })),
    depth: PropTypes.number,
    onLikeClick: PropTypes.func,
    onDislikeClick: PropTypes.func,
    onSendComment: PropTypes.func,
  };

  static defaultProps = {
    username: undefined,
    sort: 'BEST',
    rootPostAuthor: undefined,
    commentsChildren: undefined,
    pendingVotes: [],
    depth: 0,
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

  componentDidMount() {
    const { comment } = this.props;
    const anchorLink = `#@${comment.author}/${comment.permlink}`;
    if (window.location.hash === anchorLink || comment.focus) {
      this.focus();
    }
  }

  setSelf = (c) => {
    this.self = c;
  };

  focus = () => {
    if (this.self && window) {
      this.self.scrollIntoView(true);
      document.body.scrollTop -= 54 * 2; // twice the height of Topnav 
      this.self.classList.add('Comment--focus');
    }
  }

  handleAnchorClick = () => this.focus();

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

  handleLikeClick = () => {
    this.props.onLikeClick(this.props.comment.id);
  }

  handleDisLikeClick = () => {
    this.props.onDislikeClick(this.props.comment.id);
  }

  render() {
    const {
      intl,
      authenticated,
      username,
      comment,
      sort,
      rootPostAuthor,
      commentsChildren,
      pendingVotes,
      depth,
    } = this.props;

    const pendingVote = find(pendingVotes, { id: comment.id });
    const pendingLike = pendingVote && (pendingVote.percent > 0 || pendingVote.vote === 'like');
    const pendingDisLike = pendingVote && (pendingVote.percent < 0 || pendingVote.vote === 'dislike');

    const payout = calculatePayout(comment);

    const upVotes = getUpvotes(comment.active_votes).sort(sortVotes);
    const downVotes = getDownvotes(comment.active_votes).sort(sortVotes).reverse();

    const upVotesPreview = take(upVotes, 10)
      .map(vote => <p key={vote.voter}>{vote.voter}</p>);
    const upVotesDiff = upVotes.length - upVotesPreview.length;
    const upVotesMore = upVotesDiff > 0 &&
      intl.formatMessage({ id: 'and_more_amount', defaultMessage: 'and {amount} more' },
        { amount: upVotesDiff });

    const downVotesPreview = take(downVotes, 10)
      .map(vote => <p key={vote.voter}>{vote.voter}</p>);
    const downVotesDiff = downVotes.length - downVotesPreview.length;
    const downVotesMore = downVotesDiff > 0 &&
      intl.formatMessage({ id: 'and_more_amount', defaultMessage: 'and {amount} more' },
        { amount: downVotesDiff });

    const userVote = find(comment.active_votes, { voter: username });

    const userUpVoted = userVote && userVote.percent > 0;
    const userDownVoted = userVote && userVote.percent < 0;

    const anchorId = `@${comment.author}/${comment.permlink}`;
    const anchorLink = `${comment.url.slice(0, comment.url.indexOf('#'))}#${anchorId}`;

    return (
      <div ref={this.setSelf} className="Comment" id={anchorId}>
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
            <Tooltip title={intl.formatMessage({ id: 'reputation_score', defaultMessage: 'Reputation score' })}>
              <Tag>
                {formatter.reputation(comment.author_reputation)}
              </Tag>
            </Tooltip>
            {(comment.author === rootPostAuthor) &&
              <Tooltip title={intl.formatMessage({ id: 'original_poster', defaultMessage: 'Original poster' })}>
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
              <Link to={anchorLink} className="Comment__anchor" onClick={this.handleAnchorClick}>
                <FormattedRelative value={`${comment.created}Z`} />
              </Link>
            </Tooltip>
          </span>
          <div className="Comment__content">
            {this.state.collapsed
              ? <div className="Comment__content__collapsed">
                <FormattedMessage id="comment_collapsed" defaultMessage="Comment collapsed" />
              </div>
              : <Body body={comment.body} />}
          </div>
          <div className="Comment__footer">
            <Tooltip title={intl.formatMessage({ id: 'like', defaultMessage: 'Like' })}>
              <a
                role="presentation"
                className={classNames('Comment__footer__link', {
                  'Comment__footer__link--active': userUpVoted,
                })}
                onClick={this.handleLikeClick}
              >
                {pendingLike ? <Icon type="loading" /> : <i className="iconfont icon-praise_fill" />}
              </a>
            </Tooltip>
            <span
              className={classNames('Comment__footer__count', {
                'Comment__footer__count--clickable': (upVotes.length > 0) || (downVotes.length > 0),
              })}
              role="presentation"
              onClick={this.handleShowReactions}
            >
              <Tooltip
                title={
                  <div>
                    {upVotesPreview}
                    {upVotesMore}
                    {upVotesPreview.length === 0 && <FormattedMessage id="no_likes" defaultMessage="No likes yet" />}
                  </div>
                }
              >
                <FormattedNumber value={upVotes.length} />
                <span />
              </Tooltip>
            </span>
            <Tooltip title={intl.formatMessage({ id: 'dislike', defaultMessage: 'Dislike' })}>
              <a
                role="presentation"
                className={classNames('Comment__footer__link', {
                  'Comment__footer__link--active': userDownVoted,
                })}
                onClick={this.handleDisLikeClick}
              >
                {pendingDisLike ? <Icon type="loading" /> : <i className="iconfont icon-praise_fill Comment__icon_dislike" />}
              </a>
            </Tooltip>
            <span
              className={classNames('Comment__footer__count', {
                'Comment__footer__count--clickable': (upVotes.length > 0) || (downVotes.length > 0),
              })}
              role="presentation"
              onClick={this.handleShowReactions}
            >
              <Tooltip
                title={
                  <div>
                    {downVotesPreview}
                    {downVotesMore}
                    {downVotes.length === 0 && <FormattedMessage id="no_dislikes" defaultMessage="No dislikes" />}
                  </div>
                }
              >
                <FormattedNumber value={downVotes.length} />
                <span />
              </Tooltip>
            </span>
            <span className="Comment__footer__bullet" />
            <span className="Comment__footer__payout">
              <Tooltip title={<PayoutDetail post={comment} />}>
                <USDDisplay
                  value={payout.cashoutInTime ? payout.potentialPayout : payout.pastPayouts}
                />
                <span />
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
                  <FormattedMessage id="reply" defaultMessage="Reply" />
                </a>
              </span>}
          </div>
          <ReactionsModal
            visible={this.state.reactionsModalVisible}
            upVotes={upVotes}
            downVotes={downVotes}
            onClose={this.handleCloseReactions}
          />
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
          <div
            className={classNames('Comment__replies', {
              'Comment__replies--no-indent': depth > 2,
            })}
          >
            {!this.state.collapsed &&
              commentsChildren &&
              commentsChildren[comment.id] &&
              sortComments(commentsChildren[comment.id], sort).map(child =>
                (<Comment
                  key={child.id}
                  depth={depth + 1}
                  intl={this.props.intl}
                  authenticated={authenticated}
                  username={username}
                  comment={child}
                  pendingVotes={pendingVotes}
                  rootPostAuthor={rootPostAuthor}
                  commentsChildren={commentsChildren}
                  onLikeClick={this.props.onLikeClick}
                  onDislikeClick={this.props.onDislikeClick}
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
