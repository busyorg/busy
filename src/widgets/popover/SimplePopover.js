import React, { Component } from 'react';
import OnClickOutside from 'react-onclickoutside';
import './SimplePopover.scss';

const TOOLTIP_MARGIN = 10;

const getPopoverOnBottomStyle = (position, popoverWidth) => ({
  position: 'absolute',
  top: `${position.bottom + TOOLTIP_MARGIN}px`,
  left: `${(position.left + (position.width / 2)) - (popoverWidth / 2)}px`,
});

const getPopoverOnBottomLeftStyle = (position, popoverWidth) => ({
  position: 'absolute',
  top: `${position.bottom + TOOLTIP_MARGIN}px`,
  left: `${(position.left - popoverWidth) + position.width}px`,
});

const getPopoverOnRightStyle = (position, popoverWidth, popoverHeight) => ({
  position: 'absolute',
  top: `${position.bottom - (popoverHeight / 2)}px`,
  left: `${position.right + TOOLTIP_MARGIN}px`,
});

@OnClickOutside
export default class SimplePopover extends Component {
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

  // Will be triggered by OnClickOutside HoC
  handleClickOutside() {
    this.props.removePopover();
  }

  render() {
    const { pos, className, title, content, appearOn } = this.props;
    const popoverWidth = this.state.el ? this.state.el.clientWidth : 0;
    const popoverHeight = this.state.el ? this.state.el.clientHeight : 0;

    let style;

    if (appearOn === 'right') {
      style = getPopoverOnRightStyle(pos, popoverWidth, popoverHeight);
    } else if (appearOn === 'bottom-left') {
      style = getPopoverOnBottomLeftStyle(pos, popoverWidth);
    } else if(appearOn === 'bottom') {
      style = getPopoverOnBottomStyle(pos, popoverWidth);
    }

    return (
      <div className={className} style={style} ref={this.handleRef}>
        <p className={`${className}--title`}>{title}</p>
        {content}
      </div>
    );
  }
}
