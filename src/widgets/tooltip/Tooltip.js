import React, { Component } from 'react';
import { Gateway } from 'react-gateway';
import { getElementPosition } from './tooltipHelpers';
import SimpleTooltip from './SimpleTooltip';

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

  static defaultProps = {
    className: 'BusyTooltip',
    value: null,
    keep: false,
  };

  tooltipDelay = null;
  tooltipRemoveDelay = null;

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
    const { className, TemplateComp, value } = this.props;
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
