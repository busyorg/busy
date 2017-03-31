import React, { Component, PropTypes } from 'react';
import Tooltip from './Tooltip';
import './SimpleTooltip.scss';

const TOOLTIP_MARGIN = 10;

const getTooltipOnBottomStyle = (position, tooltipWidth) => ({
  position: 'absolute',
  top: `${position.bottom + TOOLTIP_MARGIN}px`,
  left: `${(position.left + (position.width / 2)) - (tooltipWidth / 2)}px`,
});

const getTooltipOnTopStyle = (position, tooltipWidth, tooltipHeight) => ({
  position: 'absolute',
  top: `${(position.top - tooltipHeight) - TOOLTIP_MARGIN}px`,
  left: `${(position.left + (position.width / 2)) - (tooltipWidth / 2)}px`,
});

export default class SimpleTooltip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      el: null,
    };
  }

  static propTypes = {
    pos: PropTypes.shape({
      top: PropTypes.number,
      bottom: PropTypes.number,
    }),
    className: PropTypes.string,
    value: PropTypes.shape({ message: PropTypes.string }),
    appearOn: PropTypes.oneOf(['top', 'bottom']),
  };

  handleRef = (e) => {
    if (!this.state.el) {
      this.setState({ el: e });
    }
  };

  render() {
    const { pos, className, appearOn } = this.props;
    const { message } = this.props.value;
    const tooltipWidth = this.state.el ? this.state.el.clientWidth : 0;
    const tooltipHeight = this.state.el ? this.state.el.clientHeight : 0;

    const style = appearOn === 'bottom'
      ? getTooltipOnBottomStyle(pos, tooltipWidth)
      : getTooltipOnTopStyle(pos, tooltipWidth, tooltipHeight);

    return (
      <div className={className} style={style} ref={this.handleRef}>
        { message }
      </div>
    );
  }
}

export const SimpleTooltipOrigin = ({ message, children, appearOn }) => (
  <Tooltip value={{ message }} TemplateComp={SimpleTooltip} appearOn={appearOn}>
    {children}
  </Tooltip>
);
