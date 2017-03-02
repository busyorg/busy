import React, { Component, PropTypes } from 'react';
import { Gateway } from 'react-gateway';
import IsScrolling from 'react-is-scrolling';
import { getElementPosition } from './tooltipHelpers';
import SimpleTooltip from './SimpleTooltip';

const DELAY = 500;

const initialState = {
  active: false,
  pos: null,
};

@IsScrolling
export default class Tooltip extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.shape({ message: PropTypes.string }),
    appearOn: PropTypes.oneOf(['top', 'bottom']),
    TemplateComp: PropTypes.func,
  };

  static defaultProps = {
    className: 'BusyTooltip',
    value: null,
    keep: false,
    appearOn: 'top',
  };

  tooltipDelay = null;
  tooltipRemoveDelay = null;

  componentWillReceiveProps(newProps) {
    const isScrollMovedOnOpenTooltip =
      this.state.active && newProps.isScrolling && !this.props.isScrolling;
    if (isScrollMovedOnOpenTooltip) {
      this.removeTooltip(true);
    }
  }

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

  keepTooltip = () => {
    if (this.props.keep) {
      clearTimeout(this.tooltipRemoveDelay);
    }
  };

  removeTooltip = (forceNoDelay = false) => {
    const { keep } = this.props;

    // eslint-disable-next-line
    if (window && window.clearTimeout) {
      clearTimeout(this.tooltipDelay);
    }

    // add delay to remove on keep so user has time to move the mouse to the tooltip
    const delay = keep && !forceNoDelay ? DELAY : 0;
    this.tooltipRemoveDelay = setTimeout(() => {
      this.setState(initialState);
    }, delay);
  };

  renderTooltip() {
    const { className, TemplateComp, value, appearOn } = this.props;
    const { pos, posInBrowser, active } = this.state;

    if (!active) return null;

    return (
      <Gateway into="tooltip">
        <div onMouseEnter={this.keepTooltip} onMouseLeave={() => this.removeTooltip(true)}>
          <TemplateComp
            pos={pos}
            posInBrowser={posInBrowser}
            className={className}
            value={value}
            appearOn={appearOn}
          />
        </div>
      </Gateway>
    );
  }

  render() {
    const theChildElement = React.Children.only(this.props.children);

    return (
      <span>
        {React.cloneElement(
          theChildElement,
          {
            onMouseEnter: e => this.showTooltip(e),
            onMouseLeave: () => this.removeTooltip()
          }
        )}

        {this.renderTooltip()}
      </span>
    );
  }
}
