import React from 'react';
import PropTypes from 'prop-types';
import Slider from '../Slider/Slider';
import Payout from './Payout';
import Buttons from './Buttons';
import Confirmation from './Confirmation';
import './StoryFooter.less';

class StoryFooter extends React.Component {
  static propTypes = {
    post: PropTypes.shape().isRequired,
    postState: PropTypes.shape().isRequired,
    ownPost: PropTypes.bool,
    pendingLike: PropTypes.bool,
    onShareClick: PropTypes.func,
    onEditClick: PropTypes.func,
  };

  static defaultProps = {
    pendingLike: false,
    ownPost: false,
    onShareClick: () => {},
    onEditClick: () => {},
  };

  state = {
    sliderVisible: false,
    sliderValue: 100,
  };

  handleLikeClick = () => {
    if (!this.state.sliderVisible) {
      this.setState(prevState => ({ sliderVisible: !prevState.sliderVisible }));
    }
  };

  handleLikeConfirm = () => {};

  handleSliderCancel = () => this.setState({ sliderVisible: false });

  handleSliderChange = value => this.setState({ sliderValue: value });

  render() {
    const { post, postState, pendingLike, ownPost } = this.props;

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
              ownPost={ownPost}
              onLikeClick={this.handleLikeClick}
              onShareClick={this.props.onShareClick}
              onEditClick={this.props.onEditClick}
            />
          )}
        </div>
        {this.state.sliderVisible && (
          <Slider value={this.state.sliderValue} onChange={this.handleSliderChange} />
        )}
      </div>
    );
  }
}

export default StoryFooter;
