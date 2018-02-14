import React from 'react';
import PropTypes from 'prop-types';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import StickySidebar from 'sticky-sidebar';

import './BaseLayout.less';

const childPropTypes = {
  children: PropTypes.node,
};

const childDefaultProps = {
  children: null,
};

const Left = ({ children }) => (
  <div id="sidebarLeft" className="sidebar">
    <div className="sidebar__inner">{children}</div>
  </div>
);
Left.propTypes = childPropTypes;
Left.defaultProps = childDefaultProps;

const Center = ({ children }) => <div id="content">{children}</div>;
Center.propTypes = childPropTypes;
Center.defaultProps = childDefaultProps;

const Right = ({ children }) => (
  <div id="sidebarRight" className="sidebar">
    <div className="sidebar__inner">{children}</div>
  </div>
);
Right.propTypes = childPropTypes;
Right.defaultProps = childDefaultProps;

export default class BaseLayout extends React.Component {
  static Left = Left;
  static Center = Center;
  static Right = Right;

  static propTypes = childPropTypes;

  static defaultProps = childDefaultProps;

  componentDidMount() {
    // StickySidebar uses global ResizeSensor
    if (typeof window !== 'undefined') {
      window.ResizeSensor = ResizeSensor;
    }

    window.sidebarLeft = new StickySidebar('#sidebarLeft', {
      topSpacing: 77,
      bottomSpacing: 10,
      containerSelector: '.BaseLayout',
      innerWrapperSelector: '.sidebar__inner',
    });
    this.sidebarRight = new StickySidebar('#sidebarRight', {
      topSpacing: 77,
      bottomSpacing: 10,
      containerSelector: '.BaseLayout',
      innerWrapperSelector: '.sidebar__inner',
    });
  }

  render() {
    const { children } = this.props;

    return <div className="BaseLayout">{children}</div>;
  }
}
