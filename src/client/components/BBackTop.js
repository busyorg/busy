import React from 'react';
import PropTypes from 'prop-types';
import { BackTop } from 'antd';
import classNames from 'classnames';
import './BBackTop.less';

const BBackTop = ({ isModal, ...restProps }) => (
  <div className="BBackTop">
    <div
      className={classNames('BBackTop__container', {
        'BBackTop__container--shifted': isModal,
      })}
    >
      <BackTop {...restProps} className="BBackTop_button" />
    </div>
  </div>
);

BBackTop.propTypes = {
  isModal: PropTypes.bool,
};

BBackTop.defaultProps = {
  isModal: false,
};
export default BBackTop;
