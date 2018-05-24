import React from 'react';
import PropTypes from 'prop-types';
import { BackTop } from 'antd';
import classNames from 'classnames';
import './BBackTop.less';

class BBackTop extends React.Component {
  static propTypes = {
    isModal: PropTypes.bool,
    target: PropTypes.func,
    toggleHeight: PropTypes.number,
  };

  static defaultProps = {
    isModal: false,
    target: undefined,
    toggleHeight: 100,
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

  getTarget = () => (this.props.target || BBackTop.getDefaultTarget)();

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
    } else if (diff < -this.props.toggleHeight) {
      this.setState({ visible: true });
    }
  };

  render() {
    const { isModal, toggleHeight, ...otherProps } = this.props;
    return (
      this.state.visible && (
        <div className="BBackTop">
          <div
            className={classNames('BBackTop__container', {
              'BBackTop__container--shifted': this.props.isModal,
            })}
          >
            <BackTop className="BBackTop_button" {...otherProps}>
              <i className="iconfont icon-back-top" />
            </BackTop>
          </div>
        </div>
      )
    );
  }
}

export default BBackTop;
