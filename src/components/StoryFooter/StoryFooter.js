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
    sliderMode: PropTypes.oneOf(['on', 'off', 'auto']),
    pendingLike: PropTypes.bool,
    onLikeClick: PropTypes.func,
    onShareClick: PropTypes.func,
    onEditClick: PropTypes.func,
  };

  static defaultProps = {
    pendingLike: false,
    ownPost: false,
    sliderMode: 'auto',
    onLikeClick: () => {},
    onShareClick: () => {},
    onEditClick: () => {},
  };

  state = {
    sliderVisible: false,
    sliderValue: 100,
  };

  handleLikeClick = () => {
    if (this.props.sliderMode === 'on') {
      if (!this.state.sliderVisible) {
        this.setState(prevState => ({ sliderVisible: !prevState.sliderVisible }));
      }
    } else {
      this.props.onLikeClick(this.props.post, 10000);
    }
  };

  handleLikeConfirm = () => {
    this.setState({ sliderVisible: false }, () => {
      this.props.onLikeClick(this.props.post, this.state.sliderValue * 100);
    });
  };

  handleShareClick = () => this.props.onShareClick(this.props.post);

  handleEditClick = () => this.props.onEditClick(this.props.post);

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
              onShareClick={this.handleShareClick}
              onEditClick={this.handleEditClick}
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
