import _ from 'lodash';
import React from 'react';
import Slider from 'rc-slider';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import 'rc-slider/assets/index.css';

import { updateVotePowerBar } from '../../user/userActions';
import Icon from '../../widgets/Icon';
import './LikeButton.scss';

@connect(({ user }) => ({ user }), { updateVotePowerBar })
class LikeButton extends React.Component {
  state = { showPowerBar: false }

  showBar = () => this.setState({ showPowerBar: true });
  hideBar = _.debounce(() => { this.setState({ showPowerBar: false }); }, 350);
  render() {
    const { showPowerBar } = this.state;
    const { votePower } = this.props.user;
    const { onClick, active, numberOfVotes, layout, likeBarEnabled } = this.props;
    const isCardLayout = layout === 'card';
    const isListLayout = layout === 'list';
    return (
      <div onMouseLeave={this.hideBar} className="LikeBar--container">
        {likeBarEnabled && !active && showPowerBar && <div className="LikeBar">
          <span className="LikeBar--text">Power: {votePower}%</span>
          <Slider
            defaultValue={votePower} min={1} tipTransitionName="rc-slider-tooltip-zoom-down"
            onChange={this.props.updateVotePowerBar}
          />
        </div>}
        <a
          onMouseEnter={(e) => { e.persist(); this.showBar(e); }}
          onClick={() => { onClick(votePower * 100); }}
          className={active ? 'active' : ''}
        >
          <Icon name="thumb_up" sm />
          {isCardLayout &&
            <span>
              <span className="hidden-xs">
                {' '}<FormattedMessage id="like" defaultMessage="Like" />
              </span>
            </span>
          }
        </a>
        {isListLayout && <span> {numberOfVotes}</span>}
      </div>
    );
  }
}

export default LikeButton;
