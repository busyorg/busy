import _ from 'lodash';
import React from 'react';
import Slider from 'rc-slider';
import { FormattedMessage } from 'react-intl';
import 'rc-slider/assets/index.css';

import Icon from '../../widgets/Icon';

class LikeButton extends React.PureComponent {
  state = { showPowerBar: false, sliderValue: 50 }

  showBar = () => this.setState({ showPowerBar: true });
  hideBar = _.debounce(() => { this.setState({ showPowerBar: false }); }, 350);
  render() {
    const { showPowerBar, sliderValue } = this.state;
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
          <span style={{ lineHeight: '1.5' }}>Power: {sliderValue}%</span>
          <Slider
            defaultValue={sliderValue} min={1} tipTransitionName="rc-slider-tooltip-zoom-down"
            onChange={(value) => { this.setState({ sliderValue: value }); }}
          />
        </div>}
        <a
          onMouseEnter={(e) => { e.persist(); this.showBar(e); }}
          onClick={() => { onClick(sliderValue * 100); }}
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
