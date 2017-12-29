import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { take, find } from 'lodash';
import { injectIntl, FormattedNumber, FormattedMessage } from 'react-intl';
import { Icon, Tooltip } from 'antd';
import { getUpvotes, getDownvotes } from '../../helpers/voteHelpers';
import { sortVotes } from '../../helpers/sortHelpers';
import { calculatePayout } from '../../vendor/steemitHelpers';
import ReactionsModal from '../Reactions/ReactionsModal';
import withAuthActions from '../../auth/withAuthActions';
import USDDisplay from '../Utils/USDDisplay';
import PayoutDetail from '../PayoutDetail';

@injectIntl
@withAuthActions
class Buttons extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    comment: PropTypes.shape().isRequired,
    defaultVotePercent: PropTypes.number.isRequired,
    onActionInitiated: PropTypes.func.isRequired,
    editable: PropTypes.bool,
    editing: PropTypes.bool,
    replying: PropTypes.bool,
    pendingVotes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        percent: PropTypes.number,
      }),
    ),
    onLikeClick: PropTypes.func,
    onDislikeClick: PropTypes.func,
    onReplyClick: PropTypes.func,
    onEditClick: PropTypes.func,
  };

  static defaultProps = {
    editable: false,
    editing: false,
    replying: false,
    pendingVotes: [],
    onLikeClick: () => {},
    onDislikeClick: () => {},
    onReplyClick: () => {},
    onEditClick: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      reactionsModalVisible: false,
    };

    this.handleLikeClick = this.handleLikeClick.bind(this);
    this.handleDislikeClick = this.handleDislikeClick.bind(this);
    this.handleShowReactions = this.handleShowReactions.bind(this);
    this.handleCloseReactions = this.handleCloseReactions.bind(this);
  }

  handleLikeClick() {
    this.props.onActionInitiated(this.props.onLikeClick);
  }

  handleDislikeClick() {
    this.props.onActionInitiated(this.props.onDislikeClick);
  }

  handleShowReactions() {
    this.setState({
      reactionsModalVisible: true,
    });
  }

  handleCloseReactions() {
    this.setState({
      reactionsModalVisible: false,
    });
  }

  render() {
    const {
      intl,
      user,
      comment,
      pendingVotes,
      defaultVotePercent,
      editable,
      editing,
      replying,
    } = this.props;

    const pendingVote = find(pendingVotes, { id: comment.id });
    const pendingLike = pendingVote && (pendingVote.percent > 0 || pendingVote.vote === 'like');
    const pendingDisLike =
      pendingVote && (pendingVote.percent < 0 || pendingVote.vote === 'dislike');

    const payout = calculatePayout(comment);

    const upVotes = getUpvotes(comment.active_votes).sort(sortVotes);
    const downVotes = getDownvotes(comment.active_votes)
      .sort(sortVotes)
      .reverse();

    const totalPayout =
      parseFloat(comment.pending_payout_value) +
      parseFloat(comment.total_payout_value) +
      parseFloat(comment.curator_payout_value);
    const voteRshares = comment.active_votes.reduce((a, b) => a + parseFloat(b.rshares), 0);
    const ratio = totalPayout / voteRshares;

    const upVotesPreview = take(upVotes, 10).map(vote => (
      <p key={vote.voter}>
        {vote.voter}
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

    const downVotesPreview = take(downVotes, 10).map(vote => <p key={vote.voter}>{vote.voter}</p>);
    const downVotesDiff = downVotes.length - downVotesPreview.length;
    const downVotesMore =
      downVotesDiff > 0 &&
      intl.formatMessage(
        { id: 'and_more_amount', defaultMessage: 'and {amount} more' },
        { amount: downVotesDiff },
      );

    const userVote = find(comment.active_votes, { voter: user.name });

    const userUpVoted = userVote && userVote.percent > 0;
    const userDownVoted = userVote && userVote.percent < 0;

    let likeTooltip = <span>{intl.formatMessage({ id: 'like' })}</span>;
    if (userUpVoted) {
      likeTooltip = <span>{intl.formatMessage({ id: 'unlike', defaultMessage: 'Unlike' })}</span>;
    } else if (defaultVotePercent !== 10000) {
      likeTooltip = (
        <span>
          {intl.formatMessage({ id: 'like' })}{' '}
          <span style={{ opacity: 0.5 }}>
            <FormattedNumber
              style="percent" // eslint-disable-line
              value={defaultVotePercent / 10000}
            />
          </span>
        </span>
      );
    }

    return (
      <div>
        <Tooltip title={likeTooltip}>
          <a
            role="presentation"
            className={classNames('CommentFooter__link', {
              'CommentFooter__link--active': userUpVoted,
            })}
            onClick={this.handleLikeClick}
          >
            {pendingLike ? <Icon type="loading" /> : <i className="iconfont icon-praise_fill" />}
          </a>
        </Tooltip>
        <span
          className={classNames('CommentFooter__count', {
            'CommentFooter__count--clickable': upVotes.length > 0 || downVotes.length > 0,
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
        <Tooltip title={intl.formatMessage({ id: 'dislike', defaultMessage: 'Dislike' })}>
          <a
            role="presentation"
            className={classNames('CommentFooter__link', {
              'CommentFooter__link--active': userDownVoted,
            })}
            onClick={this.handleDislikeClick}
          >
            {pendingDisLike ? (
              <Icon type="loading" />
            ) : (
              <i className="iconfont icon-praise_fill Comment__icon_dislike" />
            )}
          </a>
        </Tooltip>
        <span
          className={classNames('CommentFooter__count', {
            'CommentFooter__count--clickable': upVotes.length > 0 || downVotes.length > 0,
          })}
          role="presentation"
          onClick={this.handleShowReactions}
        >
          <Tooltip
            title={
              <div>
                {downVotesPreview}
                {downVotesMore}
                {downVotes.length === 0 && (
                  <FormattedMessage id="no_dislikes" defaultMessage="No dislikes" />
                )}
              </div>
            }
          >
            <FormattedNumber value={downVotes.length} />
            <span />
          </Tooltip>
        </span>
        <span className="CommentFooter__bullet" />
        <span className="CommentFooter__payout">
          <Tooltip title={<PayoutDetail post={comment} />}>
            <USDDisplay
              value={payout.cashoutInTime ? payout.potentialPayout : payout.pastPayouts}
            />
            <span />
          </Tooltip>
        </span>
        {user.name && (
          <span>
            <span className="CommentFooter__bullet" />
            <a
              role="presentation"
              className={classNames('CommentFooter__link', {
                'CommentFooter__link--active': replying,
              })}
              onClick={this.props.onReplyClick}
            >
              <FormattedMessage id="reply" defaultMessage="Reply" />
            </a>
          </span>
        )}
        {editable && (
          <span>
            <span className="CommentFooter__bullet" />
            <a
              role="presentation"
              className={classNames('CommentFooter__link', {
                'CommentFooter__link--active': editing,
              })}
              onClick={this.props.onEditClick}
            >
              <FormattedMessage id="edit" defaultMessage="Edit" />
            </a>
          </span>
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

export default Buttons;
