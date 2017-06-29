import _ from 'lodash';
import React from 'react';
import Slider from 'rc-slider';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import 'rc-slider/assets/index.css';

import { updateVotePowerBar } from '../../user/userActions';
import Icon from '../../widgets/Icon';


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
      <div
        onMouseLeave={this.hideBar}
        style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}
      >
        {likeBarEnabled && !active && showPowerBar && <div
          style={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            width: '200px',
            flexDirection: 'column',
            background: '#fff',
            boxShadow: '1px 0px 3px 0px rgba(0, 0, 0, 0.32)',
            padding: '0px 10px',
            height: '55px',
            top: '-50px',
            justifyContent: 'center',
            borderRadius: '3px'
          }}
        >
          <span style={{ lineHeight: '1.5' }}>Power: {votePower}%</span>
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
