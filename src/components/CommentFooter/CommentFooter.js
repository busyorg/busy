import React from 'react';
import PropTypes from 'prop-types';
import { getHasDefaultSlider, getVoteValue } from '../../helpers/user';
import Slider from '../Slider/Slider';
import Buttons from './Buttons';
import Confirmation from './Confirmation';
import './CommentFooter.less';

export default class CommentFooter extends React.Component {
  static propTypes = {
    user: PropTypes.shape().isRequired,
    comment: PropTypes.shape().isRequired,
    rewardFund: PropTypes.shape().isRequired,
    defaultVotePercent: PropTypes.number.isRequired,
    sliderMode: PropTypes.oneOf(['on', 'off', 'auto']),
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
    pendingLike: false,
    ownPost: false,
    sliderMode: 'auto',
    editable: false,
    editing: false,
    replying: false,
    pendingVotes: [],
    onLikeClick: () => {},
    onDislikeClick: () => {},
    onReplyClick: () => {},
    onEditClick: () => {},
  };

  state = {
    sliderVisible: false,
    sliderValue: 100,
    voteWorth: 0,
    replyFormVisible: false,
  };

  componentWillMount() {
    const { user, comment, defaultVotePercent } = this.props;
    if (user) {
      const userVote = find(comment.active_votes, { voter: user.name }) || {};

      if (userVote.percent && userVote.percent > 0) {
        this.setState({
          sliderValue: userVote.percent / 100,
        });
      } else {
        this.setState({
          sliderValue: defaultVotePercent / 100,
        });
      }
    }
  }

  handleLikeClick = () => {
    const { sliderMode, user, comment } = this.props;
    if (sliderMode === 'on' || (sliderMode === 'auto' && getHasDefaultSlider(user))) {
      if (!this.state.sliderVisible) {
        this.setState(prevState => ({ sliderVisible: !prevState.sliderVisible }));
      }
    } else {
      this.props.onLikeClick(comment.id);
    }
  };

  handleLikeConfirm = () => {
    this.setState({ sliderVisible: false }, () => {
      this.props.onLikeClick(this.props.comment.id, this.state.sliderValue * 100);
    });
  };

  handleDislikeClick = () => this.props.onDislikeClick(this.props.comment.id);

  handleSliderCancel = () => this.setState({ sliderVisible: false });

  handleSliderChange = (value) => {
    const { user, rewardFund } = this.props;
    const voteWorth = getVoteValue(
      user,
      rewardFund.recent_claims,
      rewardFund.reward_balance,
      value * 100,
    );
    this.setState({ sliderValue: value, voteWorth });
  };

  render() {
    const {
      user,
      comment,
      defaultVotePercent,
      editable,
      editing,
      replying,
      pendingVotes,
    } = this.props;
    const { sliderVisible } = this.state;

    let actionPanel = null;
    if (sliderVisible) {
      actionPanel = (
        <Confirmation onConfirm={this.handleLikeConfirm} onCancel={this.handleSliderCancel} />
      );
    } else {
      actionPanel = (
        <Buttons
          editable={editable}
          editing={editing}
          replying={replying}
          user={user}
          comment={comment}
          pendingVotes={pendingVotes}
          defaultVotePercent={defaultVotePercent}
          onLikeClick={this.handleLikeClick}
          onDislikeClick={this.handleDislikeClick}
          onReplyClick={this.props.onReplyClick}
          onEditClick={this.props.onEditClick}
        />
      );
    }

    return (
      <div className="CommentFooter">
        {actionPanel}
        {sliderVisible && (
          <Slider
            value={this.state.sliderValue}
            voteWorth={this.state.voteWorth}
            onChange={this.handleSliderChange}
          />
        )}
      </div>
    );
  }
}
