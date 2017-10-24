import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import { Link } from 'react-router-dom';
import { take } from 'lodash';
import { Icon, Tooltip, Modal } from 'antd';
import classNames from 'classnames';
import { sortVotes } from '../../helpers/sortHelpers';
import { getUpvotes, getDownvotes } from '../../helpers/voteHelpers';
import { calculatePayout } from '../../vendor/steemitHelpers';
import ReactionsModal from '../Reactions/ReactionsModal';
import USDDisplay from '../Utils/USDDisplay';
import PayoutDetail from '../PayoutDetail';
import './StoryFooter.less';

@injectIntl
class StoryFooter extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    post: PropTypes.shape().isRequired,
    postState: PropTypes.shape().isRequired,
    pendingLike: PropTypes.bool,
    onLikeClick: PropTypes.func,
    onShareClick: PropTypes.func,
    ownPost: PropTypes.bool,
    onEditClick: PropTypes.func,
  };

  static defaultProps = {
    pendingLike: false,
    ownPost: false,
    onLikeClick: () => {},
    onShareClick: () => {},
    onEditClick: () => {},
  };

  state = {
    shareModalVisible: false,
    shareModalLoading: false,
    reactionsModalVisible: false,
    loadingEdit: false,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.postState.isReblogging !== this.props.postState.isReblogging) {
      this.setState({
        shareModalLoading: nextProps.postState.isReblogging,
        shareModalVisible:
          !(!nextProps.postState.isReblogging && this.props.postState.isReblogging) &&
          this.state.shareModalVisible,
      });
    }
  }

  handleShareClick = (e) => {
    e.preventDefault();
    if (this.props.postState.isReblogged) {
      return;
    }

    this.setState({
      shareModalVisible: true,
    });
  };

  handleShareOk = () => {
    this.props.onShareClick();
  };

  handleShareCancel = () => {
    this.setState({
      shareModalVisible: false,
    });
  };

  handleShowReactions = () =>
    this.setState({
      reactionsModalVisible: true,
    });

  handleCloseReactions = () =>
    this.setState({
      reactionsModalVisible: false,
    });

  handleCommentClick = () => {
    const form = document.getElementById('commentFormInput');
    if (form) {
      form.scrollIntoView(true);
      document.body.scrollTop -= 200;
      form.focus();
    }
  };

  handleEdit = () => {
    this.setState({
      loadingEdit: true,
    });
    this.props.onEditClick(this.props.post);
  };

  render() {
    const { intl, post, postState, pendingLike, onLikeClick, ownPost } = this.props;

    const payout = calculatePayout(post);

    const upVotes = getUpvotes(post.active_votes).sort(sortVotes);
    const downVotes = getDownvotes(post.active_votes).sort(sortVotes).reverse();

    const totalPayout =
      parseFloat(post.pending_payout_value) +
      parseFloat(post.total_payout_value) +
      parseFloat(post.curator_payout_value);
    const voteRshares = post.active_votes.reduce((a, b) => a + parseFloat(b.rshares), 0);
    const ratio = totalPayout / voteRshares;

    const upVotesPreview = take(upVotes, 10).map(vote => (
      <p key={vote.voter}>
        <Link to={`/@${vote.voter}`}>
          {vote.voter}
        </Link>

        {vote.rshares * ratio > 0.01 && (
          <span style={{ opacity: '0.5' }}>
            {' '}
            <USDDisplay value={vote.rshares * ratio} />
          </span>
        )}
      </p>
    ));
    const upVotesDiff = upVotes.length - upVotesPreview.length;
    const upVotesMore =
      upVotesDiff > 0 &&
      intl.formatMessage(
        { id: 'and_more_amount', defaultMessage: 'and {amount} more' },
        { amount: upVotesDiff },
      );

    const likeClass = classNames({ active: postState.isLiked, StoryFooter__link: true });
    const rebloggedClass = classNames({ active: postState.isReblogged, StoryFooter__link: true });

    const commentsLink =
      post.url.indexOf('#') !== -1 ? post.url : { pathname: post.url, hash: '#comments' };
    const showEditLink = ownPost && post.cashout_time !== '1969-12-31T23:59:59';
    const showReblogLink = !ownPost && post.parent_author === '';

    return (
      <div className="StoryFooter">
        <span className="StoryFooter__payout">
          <Tooltip title={<PayoutDetail post={post} />}>
            <span
              className={classNames({
                'StoryFooter__payout--rejected': payout.isPayoutDeclined,
              })}
            >
              <USDDisplay
                value={payout.cashoutInTime ? payout.potentialPayout : payout.pastPayouts}
              />
            </span>
          </Tooltip>
          {post.percent_steem_dollars === 0 && (
            <Tooltip
              title={intl.formatMessage({
                id: 'reward_option_100',
                defaultMessage: '100% Steem Power',
              })}
            >
              <i className="iconfont icon-flashlight" />
            </Tooltip>
          )}
        </span>
        <Tooltip title={intl.formatMessage({ id: 'like' })}>
          <a role="presentation" className={likeClass} onClick={() => onLikeClick()}>
            {pendingLike ? <Icon type="loading" /> : <i className="iconfont icon-praise_fill" />}
          </a>
        </Tooltip>
        <span
          className={classNames('StoryFooter__number', {
            'StoryFooter__reactions-count': upVotes.length > 0 || downVotes.length > 0,
          })}
          role="presentation"
          onClick={this.handleShowReactions}
        >
          <Tooltip
            title={
              <div>
                {upVotesPreview}
                {upVotesMore}
                {upVotesPreview.length === 0 && (
                  <FormattedMessage id="no_likes" defaultMessage="No likes yet" />
                )}
              </div>
            }
          >
            <FormattedNumber value={upVotes.length} />
            <span />
          </Tooltip>
        </span>
        <Tooltip title={intl.formatMessage({ id: 'comment', defaultMessage: 'Comment' })}>
          <Link className="StoryFooter__link" to={commentsLink} onClick={this.handleCommentClick}>
            <i className="iconfont icon-message_fill" />
          </Link>
        </Tooltip>
        <span className="StoryFooter__number">
          <FormattedNumber value={post.children} />
        </span>
        {showReblogLink && (
          <Tooltip
            title={intl.formatMessage({
              id: postState.reblogged ? 'reblog_reblogged' : 'reblog',
              defaultMessage: postState.reblogged ? 'You already reblogged this post' : 'Reblog',
            })}
          >
            <a role="presentation" className={rebloggedClass} onClick={this.handleShareClick}>
              <i className="iconfont icon-share1 StoryFooter__share" />
            </a>
          </Tooltip>)}
        {showEditLink &&
          <a role="presentation" className="StoryFooter__link" onClick={this.handleEdit}>
            {this.state.loadingEdit ? <Icon type="loading" /> : <i className="iconfont icon-write" />}
            <FormattedMessage id="edit" defaultMessage="Edit" />
          </a>}
        {!postState.isReblogged && (
          <Modal
            title={intl.formatMessage({
              id: 'reblog_modal_title',
              defaultMessage: 'Reblog this post?',
            })}
            visible={this.state.shareModalVisible}
            confirmLoading={this.state.shareModalLoading}
            okText={intl.formatMessage({ id: 'reblog', defaultMessage: 'Reblog' })}
            cancelText={intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
            onOk={this.handleShareOk}
            onCancel={this.handleShareCancel}
          >
            <FormattedMessage
              id="reblog_modal_content"
              defaultMessage="This post will appear on your personal feed. This action cannot be reversed."
            />
          </Modal>
        )}
        <ReactionsModal
          visible={this.state.reactionsModalVisible}
          upVotes={upVotes}
          ratio={ratio}
          downVotes={downVotes}
          onClose={this.handleCloseReactions}
        />
      </div>
    );
  }
}

export default StoryFooter;
