import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Action.less';

const Action = ({ style, children, href, primary, small }) => (
  <a
    href={href}
    style={style}
    className={classNames('Action', {
      'ant-btn-lg': !small,
      'Action--primary': primary,
    })}
  >
    {children}
  </a>
);

Action.propTypes = {
  style: PropTypes.shape(),
  children: PropTypes.node,
  href: PropTypes.string,
  primary: PropTypes.bool,
  small: PropTypes.bool,
};

Action.defaultProps = {
  style: {},
  children: null,
  href: '#',
  primary: false,
  small: false,
};

export default Action;
