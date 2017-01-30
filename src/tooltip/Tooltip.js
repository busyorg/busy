import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as tooltipActions from './tooltipActions';

const DELAY = 500;
const TOOLTIP_MARGIN = 20;

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

@connect(
  state => ({
    tooltip: state.currentTooltip,
  }),
  dispatch => bindActionCreators({
    showTooltip: tooltipActions.showTooltip,
    hideTooltip: tooltipActions.hideTooltip,
  }, dispatch)
)
export default class Tooltip extends Component {
  constructor(props) {
    super(props);
  }

  tooltipDelay = null;

  static defaultProps = {
    message: '',
  };

  showTooltip = (e) => {
    const { message } = this.props;
    const pos =
      e.target &&
      e.target.getBoundingClientRect &&
      e.target.getBoundingClientRect();

    this.tooltipDelay = setTimeout(() => {
      this.props.showTooltip({
        active: true,
        pos,
        message
      });
    }, DELAY);
  };

  removeTooltip = () => {
    // eslint-disable-next-line
    if (window && window.clearTimeout) {
      clearTimeout(this.tooltipDelay);
    }

    this.props.hideTooltip();
  };

  render() {
    const { className, message, tooltip } = this.props;
    const { pos, active } = this.state;

    return (
      <span onMouseEnter={this.showTooltip} onMouseLeave={this.removeTooltip}>
        { this.props.children }
        { active &&
          renderTooltip({
            message,
            pos,
            className
          })
        }
      </span>
    );
  }
}
