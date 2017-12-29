import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from 'antd';
import './Loading.less';

const Loading = ({ center, style }) => (
  <div className={classNames('Loading', { 'Loading--center': center })} style={style}>
    <Icon className="Loading__icon" type="loading" />
  </div>
);

Loading.propTypes = {
  center: PropTypes.bool,
  style: PropTypes.shape(),
};

Loading.defaultProps = {
  center: true,
  style: {},
};

export default Loading;
