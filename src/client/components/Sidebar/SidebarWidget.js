import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './SidebarWidget.less';

export default function SidebarWidget({ children, title, refreshable, icon, footer, onRefresh }) {
  return (
    <div className="SidebarWidget">
      <div className="SidebarWidget__header">
        <div>
          <i className={classNames('iconfont', 'SidebarWidget__icon', icon)} />
          {title}
        </div>
        {refreshable && (
          <button className="SidebarWidget__icon-right" onClick={onRefresh}>
            <i className="iconfont icon-refresh" />
          </button>
        )}
      </div>
      <div className="SidebarWidget__content">{children}</div>
      {footer && <div className="SidebarWidget__footer">{footer}</div>}
    </div>
  );
}

SidebarWidget.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  refreshable: PropTypes.bool,
  icon: PropTypes.string,
  footer: PropTypes.node,
  onRefresh: PropTypes.func,
};

SidebarWidget.defaultProps = {
  refreshable: false,
  icon: 'icon-flashlight',
  footer: null,
  onRefresh: () => {},
};
