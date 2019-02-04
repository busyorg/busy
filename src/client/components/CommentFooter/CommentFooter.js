import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import { getHasDefaultSlider, getVoteValue } from '../../helpers/user';
import Slider from '../Slider/Slider';
import Buttons from './Buttons';
import Confirmation from './Confirmation';
import { getRate } from '../../reducers';
import './CommentFooter.less';

@connect(state => ({
  rate: getRate(state),
}))
export default class CommentFooter extends React.Component {
  static propTypes = {
    user: PropTypes.shape().isRequired,
    comment: PropTypes.shape().isRequired,
    rewardFund: PropTypes.shape().isRequired,
    rate: PropTypes.number.isRequired,
    defaultVotePercent: PropTypes.number.isRequired,
    sliderMode: PropTypes.oneOf(['on', 'off', 'auto']),
    editable: PropTypes.bool,
    editing: PropTypes.bool,
    replying: PropTypes.bool,
    pendingVotes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
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
    sliderMode: null,
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
    const shouldSeeSlider =
      sliderMode === 'on' || (sliderMode === 'auto' && getHasDefaultSlider(user));

    const userVote = find(comment.active_votes, { voter: user.name }) || {};
    if ((isEmpty(userVote) || userVote.percent === 0) && shouldSeeSlider) {
      if (!this.state.sliderVisible) {
        this.setState(prevState => ({
          sliderVisible: !prevState.sliderVisible,
          sliderMode: 'like',
        }));
      }
    } else {
      this.props.onLikeClick(comment.id);
    }
  };

  handleDislikeClick = () => {
    const { sliderMode, user, comment } = this.props;
    const shouldSeeSlider =
      sliderMode === 'on' || (sliderMode === 'auto' && getHasDefaultSlider(user));

    const userVote = find(comment.active_votes, { voter: user.name }) || {};
    if ((isEmpty(userVote) || userVote.percent === 0) && shouldSeeSlider) {
      if (!this.state.sliderVisible) {
        this.setState(prevState => ({
          sliderVisible: !prevState.sliderVisible,
          sliderMode: 'dislike',
        }));
      }
    } else {
      this.props.onDislikeClick(comment.id);
    }
  };

  handleSliderConfirm = () => {
    this.setState({ sliderVisible: false }, () => {
      if (this.state.sliderMode === 'like') {
        this.props.onLikeClick(this.props.comment.id, this.state.sliderValue * 100);
      } else if (this.state.sliderMode === 'dislike') {
        this.props.onDislikeClick(this.props.comment.id, -this.state.sliderValue * 100);
      }
    });
  };

  handleSliderCancel = () => this.setState({ sliderVisible: false });

  handleSliderChange = value => {
    const { user, rewardFund, rate } = this.props;
    const voteWorth = getVoteValue(
      user,
      rewardFund.recent_claims,
      rewardFund.reward_balance,
      rate,
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
        <Confirmation onConfirm={this.handleSliderConfirm} onCancel={this.handleSliderCancel} />
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
