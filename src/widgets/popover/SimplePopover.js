import React, { Component } from 'react';
import OnClickOutside from 'react-onclickoutside';
import './SimplePopover.scss';

const TOOLTIP_MARGIN = 10;

const getPopoverOnBottomStyle = (position, popoverWidth) => ({
  position: 'absolute',
  top: `${position.bottom + TOOLTIP_MARGIN}px`,
  left: `${(position.left + (position.width / 2)) - (popoverWidth / 2)}px`,
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

  handleClickOutside() {
    this.props.removePopover();
  }

  render() {
    const { pos, className, title, content } = this.props;
    const popoverWidth = this.state.el ? this.state.el.clientWidth : 0;

    const style = getPopoverOnBottomStyle(pos, popoverWidth);

    return (
      <div className={className} style={style} ref={this.handleRef}>
        <p className={`${className}--title`}>{title}</p>
        {content}
      </div>
    );
  }
}
