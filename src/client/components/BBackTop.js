import React from 'react';
import PropTypes from 'prop-types';
import { BackTop } from 'antd';
import classNames from 'classnames';
import './BBackTop.less';

class BBackTop extends React.Component {
  static propTypes = {
    isModal: PropTypes.bool,
    target: PropTypes.node,
  };

  static defaultProps = {
    isModal: false,
    target: undefined,
  };

  static getDefaultTarget() {
    return window;
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    this.scrollEvent = this.getTarget().addEventListener('scroll', this.handleScroll);
    this.timer = setInterval(() => {
      if (Date.now() - this.lastTick > 3000) {
        this.setState({ visible: true });
      }
    }, 500);
    this.lastTick = 0;
  }

  componentWillUnmount() {
    if (this.scrollEvent) this.scrollEvent.remove();
    if (this.timer) clearInterval(this.timer);
  }

  getTarget() {
    return this.props.target || BBackTop.getDefaultTarget();
  }

  handleScroll = () => {
    this.lastTick = Date.now();
    if (this.state.visible === true) {
      this.setState({ visible: false });
    }
  };

  render() {
    return (
      this.state.visible && (
        <div className="BBackTop">
          <div
            className={classNames('BBackTop__container', {
              'BBackTop__container--shifted': this.props.isModal,
            })}
          >
            <BackTop {...this.props} className="BBackTop_button" />
          </div>
        </div>
      )
    );
  }
}

export default BBackTop;
