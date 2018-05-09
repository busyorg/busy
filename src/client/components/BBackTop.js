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

  static getScroll(target) {
    if (typeof window === 'undefined') return 0;

    return target === window ? target.pageYOffset : target.scrollTop;
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    this.previousScroll = 0;
    this.scrollEvent = this.getTarget().addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    if (this.scrollEvent) this.scrollEvent.remove();
  }

  getTarget = () => this.props.target || BBackTop.getDefaultTarget();

  handleScroll = () => {
    const currentScroll = BBackTop.getScroll(this.getTarget());
    if (currentScroll === 0) {
      this.previousScroll = 0;
      return;
    }

    const diff = currentScroll - this.previousScroll;
    if (diff > 0) {
      this.previousScroll = currentScroll;
      this.setState({ visible: false });
    } else if (diff < -100) {
      this.setState({ visible: true });
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
            <BackTop {...this.props} className="BBackTop_button">
              <i className="iconfont icon-back-top" />
            </BackTop>
          </div>
        </div>
      )
    );
  }
}

export default BBackTop;
