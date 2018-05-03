import React from 'react';
import PropTypes from 'prop-types';
import { BackTop } from 'antd';
import './BBackTop.less';

const BBackTop = props => (
  <div className="BBackTop">
    <div className="container" style={props.isModal && { maxWidth: '935px' }}>
      <BackTop {...props} className="BBackTop_button" />
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
