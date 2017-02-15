import React, { Component } from 'react';
import { getElementPosition } from './tooltipHelpers';
import TooltipBox from './TooltipBox';

const DELAY = 500;

const initialState = {
  active: false,
  pos: null,
};


export default class Tooltip extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  tooltipDelay = null;

  static defaultProps = {
    message: '',
    className: 'BusyTooltip',
  };

  showTooltip = (e) => {
    const pos = e.target && getElementPosition(e.target);
    const posInBrowser = e.target && e.target.getBoundingClientRect();

    this.tooltipDelay = setTimeout(() => {
      this.setState({
        active: true,
        pos,
        posInBrowser,
      });
    }, DELAY);
  };

  removeTooltip = () => {
    // eslint-disable-next-line
    if (window && window.clearTimeout) {
      clearTimeout(this.tooltipDelay);
    }

    this.setState(initialState);
  };

  render() {
    const { className, message } = this.props;
    const { pos, posInBrowser, active } = this.state;

    return (
      <span onMouseEnter={this.showTooltip} onMouseLeave={this.removeTooltip}>
        { this.props.children }
        { active &&
          <TooltipBox
            pos={pos}
            message={message}
            posInBrowser={posInBrowser}
            className={className}
          />
        }
      </span>
    );
  }
}
