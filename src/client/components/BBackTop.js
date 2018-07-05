import React from 'react';
import PropTypes from 'prop-types';
import { BackTop } from 'antd';
import classNames from 'classnames';
import './BBackTop.less';

export default function BBackTop({ className, isModal, ...otherProps }) {
  return (
    <div className="BBackTop">
      <div
        className={classNames(className, 'BBackTop__container', {
          'BBackTop__container--shifted': isModal,
        })}
      >
        <BackTop className="BBackTop_button" {...otherProps}>
          <i className="iconfont icon-back-top" />
        </BackTop>
      </div>
    </div>
  );
}

BBackTop.propTypes = {
  className: PropTypes.string,
  isModal: PropTypes.bool,
};

BBackTop.defaultProps = {
  className: '',
  isModal: false,
};
