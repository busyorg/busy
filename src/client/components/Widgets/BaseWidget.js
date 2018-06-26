import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './BaseWidget.less';

export default function BaseWidget({ children, title, refreshable, icon, footer, onRefresh }) {
  return (
    <div className="BaseWidget">
      <div className="BaseWidget__header">
        <div>
          <i className={classNames('iconfont', 'BaseWidget__icon', icon)} />
          {title}
        </div>
        {refreshable && (
          <button className="BaseWidget__icon-right" onClick={onRefresh}>
            <i className="iconfont icon-refresh" />
          </button>
        )}
      </div>
      <div className="BaseWidget__content">{children}</div>
      {footer && <div className="BaseWidget__footer">{footer}</div>}
    </div>
  );
}

BaseWidget.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  refreshable: PropTypes.bool,
  icon: PropTypes.string,
  footer: PropTypes.node,
  onRefresh: PropTypes.func,
};

BaseWidget.defaultProps = {
  refreshable: false,
  icon: 'icon-flashlight',
  footer: null,
  onRefresh: () => {},
};
