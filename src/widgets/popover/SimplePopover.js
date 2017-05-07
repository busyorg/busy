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
    const { pos, posInBrowser, className, containerClassName, title, content, appearOn, fixedPosition } = this.props;
    const popoverWidth = this.state.el ? this.state.el.clientWidth : 0;
    const popoverHeight = this.state.el ? this.state.el.clientHeight : 0;

    let style;

    const posRef = fixedPosition ? posInBrowser : pos;

    if (appearOn === 'right') {
      style = getPopoverOnRightStyle(posRef, popoverWidth, popoverHeight, fixedPosition);
    } else if (appearOn === 'bottom-left') {
      style = getPopoverOnBottomLeftStyle(posRef, popoverWidth, fixedPosition);
    } else if(appearOn === 'bottom') {
      style = getPopoverOnBottomStyle(posRef, popoverWidth, fixedPosition);
    }

    return (
      <div className={`${className} ${containerClassName}`} style={style} ref={this.handleRef}>
        <p className={`${className}--title`}>{title}</p>
        {content}
      </div>
    );
  }
}
