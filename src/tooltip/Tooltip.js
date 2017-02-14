import React, { Component } from 'react';

const DELAY = 500;
const TOOLTIP_MARGIN = 20;

const initialState = {
  active: false,
  pos: null,
};

const renderTooltip = ({ message, pos, className }) => {
  const getTooltipOnBottomStyle = position => ({
    position: 'absolute',
    top: `${position.bottom + TOOLTIP_MARGIN}px`,
    left: `${position.left}px`,
  });

  const getTooltipOnTopStyle = position => ({
    position: 'absolute',
    bottom: `${position.top + TOOLTIP_MARGIN}px`,
    left: `${position.left}px`,
  });

  const style = pos.top < 150 ? getTooltipOnBottomStyle(pos) : getTooltipOnTopStyle(pos);

  return (
    <div className={className} style={style}>
      { message }
    </div>
  );
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
    const { message } = this.props;
    const pos =
      e.target &&
      e.target.getBoundingClientRect &&
      e.target.getBoundingClientRect();

    this.tooltipDelay = setTimeout(() => {
      this.setState({
        active: true,
        pos,
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
    const { pos, active } = this.state;

    return (
      <span onMouseEnter={this.showTooltip} onMouseLeave={this.removeTooltip}>
        { this.props.children }
        { active &&
          renderTooltip({
            message,
            pos,
            className,
          })
        }
      </span>
    );
  }
}
