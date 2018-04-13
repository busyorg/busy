import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';

class BTooltip extends React.Component {
  static propTypes = {
    title: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      bottom: false,
    };

    this.setTitle = this.setTitle.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.handleVisibleChange = this.handleVisibleChange.bind(this);
  }

  setTitle(ref) {
    this.titleRef = ref;
  }

  updatePosition() {
    if (!this.titleRef) return;

    const ratio = this.titleRef.getBoundingClientRect().top / window.innerHeight;

    this.setState({
      bottom: ratio < 0.45,
    });
  }

  handleVisibleChange(visible) {
    if (!visible) return;

    this.updatePosition();
  }

  render() {
    const { title, ...props } = this.props;
    const { bottom } = this.state;

    return (
      <Tooltip
        {...props}
        title={<div ref={this.setTitle}>{title}</div>}
        placement={bottom ? 'bottom' : 'top'}
        onVisibleChange={this.handleVisibleChange}
      />
    );
  }
}

export default BTooltip;
