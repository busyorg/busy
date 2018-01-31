import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import find from 'lodash/find';
import Slider from '../Slider/Slider';
import Payout from './Payout';
import Buttons from './Buttons';
import Confirmation from './Confirmation';
import { getHasDefaultSlider, getVoteValue } from '../../helpers/user';
import { getRate } from '../../reducers';
import './StoryFooter.less';

@connect(state => ({
  rate: getRate(state),
}))
class StoryFooter extends React.Component {
  static propTypes = {
    user: PropTypes.shape().isRequired,
    post: PropTypes.shape().isRequired,
    postState: PropTypes.shape().isRequired,
    rewardFund: PropTypes.shape().isRequired,
    rate: PropTypes.number.isRequired,
    defaultVotePercent: PropTypes.number.isRequired,
    ownPost: PropTypes.bool,
    sliderMode: PropTypes.oneOf(['on', 'off', 'auto']),
    pendingLike: PropTypes.bool,
    pendingFlag: PropTypes.bool,
    pendingFollow: PropTypes.bool,
    pendingBookmark: PropTypes.bool,
    saving: PropTypes.bool,
    onLikeClick: PropTypes.func,
    onShareClick: PropTypes.func,
    onEditClick: PropTypes.func,
    handlePostPopoverMenuClick: PropTypes.func,
  };

  static defaultProps = {
    pendingLike: false,
    pendingFlag: false,
    ownPost: false,
    pendingFollow: false,
    pendingBookmark: false,
    saving: false,
    sliderMode: 'auto',
    onLikeClick: () => {},
    onShareClick: () => {},
    onEditClick: () => {},
    handlePostPopoverMenuClick: () => {},
  };

  state = {
    sliderVisible: false,
    sliderValue: 100,
    voteWorth: 0,
  };

  componentWillMount() {
    const { user, post, defaultVotePercent } = this.props;
    if (user) {
      const userVote = find(post.active_votes, { voter: user.name }) || {};

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
    const { sliderMode, user } = this.props;
    if (sliderMode === 'on' || (sliderMode === 'auto' && getHasDefaultSlider(user))) {
      if (!this.state.sliderVisible) {
        this.setState(prevState => ({ sliderVisible: !prevState.sliderVisible }));
      }
    } else {
      this.props.onLikeClick(this.props.post, this.props.postState);
    }
  };

  handleLikeConfirm = () => {
    this.setState({ sliderVisible: false }, () => {
      this.props.onLikeClick(this.props.post, this.props.postState, this.state.sliderValue * 100);
    });
  };

  handleShareClick = () => this.props.onShareClick(this.props.post);

  handleEditClick = () => this.props.onEditClick(this.props.post);

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
      post,
      postState,
      pendingLike,
      pendingFlag,
      ownPost,
      defaultVotePercent,
      pendingFollow,
      pendingBookmark,
      saving,
      handlePostPopoverMenuClick,
    } = this.props;

    return (
      <div className="StoryFooter">
        <div className="StoryFooter__actions">
          <Payout post={post} />
          {this.state.sliderVisible && (
            <Confirmation onConfirm={this.handleLikeConfirm} onCancel={this.handleSliderCancel} />
          )}
          {!this.state.sliderVisible && (
            <Buttons
              post={post}
              postState={postState}
              pendingLike={pendingLike}
              pendingFlag={pendingFlag}
              pendingFollow={pendingFollow}
              pendingBookmark={pendingBookmark}
              saving={saving}
              ownPost={ownPost}
              defaultVotePercent={defaultVotePercent}
              onLikeClick={this.handleLikeClick}
              onShareClick={this.handleShareClick}
              onEditClick={this.handleEditClick}
              handlePostPopoverMenuClick={handlePostPopoverMenuClick}
            />
          )}
        </div>
        {this.state.sliderVisible && (
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

export default StoryFooter;
