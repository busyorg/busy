import React, { Component } from 'react';
import { Gateway } from 'react-gateway';
import './Tooltip.scss';

const TOOLTIP_MARGIN = 10;

const getTooltipOnBottomStyle = (position, tooltipWidth) => ({
  position: 'absolute',
  top: `${position.bottom + TOOLTIP_MARGIN}px`,
  left: `${(position.left + (position.width / 2)) - (tooltipWidth / 2)}px`,
});

export default class TooltipBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      el: null,
    };
  }

  handleRef = (e) => {
    if (!this.state.el) {
      this.setState({ el: e });
    }
  };

  render() {
    const { message, pos, className } = this.props;
    const tooltipWidth = this.state.el ? this.state.el.clientWidth : 0;

    const style = getTooltipOnBottomStyle(pos, tooltipWidth);

    return (
      <Gateway into="tooltip">
        <div className={className} style={style} ref={this.handleRef}>
          { message }
        </div>
      </Gateway>
    );
  }
}
