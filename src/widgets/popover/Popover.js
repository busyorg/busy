import React, { Component } from 'react';
import { Gateway } from 'react-gateway';
import { getElementPosition } from '../tooltip/tooltipHelpers';
import SimplePopover from './SimplePopover';

const initialState = {
  active: false,
  pos: null,
};


export default class Popover extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  static defaultProps = {
    className: 'BusyPopover',
    value: null,
  };

  showPopover = (e) => {
    e.preventDefault();
    const pos = e.target && getElementPosition(e.target);
    const posInBrowser = e.target && e.target.getBoundingClientRect();

    this.setState({
      active: true,
      pos,
      posInBrowser,
    });
  };

  removePopover = () => {
    this.setState(initialState);
  };

  renderPopover() {
    const { className, title, content } = this.props;
    const { pos, posInBrowser, active } = this.state;

    if (!active) return null;

    return (
      <Gateway into="popover">
        <SimplePopover
          pos={pos}
          posInBrowser={posInBrowser}
          className={className}
          title={title}
          content={content}
          removePopover={() => this.removePopover()}
        />
      </Gateway>
    );
  }

  render() {
    return (
      <span onClick={this.showPopover}>
        {this.props.children}
        {this.renderPopover()}
      </span>
    );
  }
}
