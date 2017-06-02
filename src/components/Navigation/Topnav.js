import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Menu, Popover, Icon, Input } from 'antd';
import Avatar from '../Avatar';
import './Topnav.less';

const SubMenu = Menu.SubMenu;

class Topnav extends React.Component {
  static propTypes = {
    username: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      notificationsVisible: false,
    };
  }

  onNotificationChange(openKeys) {
    if (openKeys.indexOf('notifications') !== -1) {
      this.setState({ notificationsVisible: true });
    } else {
      this.setState({ notificationsVisible: false });
    }
  }

  render() {
    const { username } = this.props;

    let content;

    if (username) {
      content = (
        <div className="Topnav__menu-container">
          <Menu
            className="Topnav__menu"
            mode="horizontal"
            onOpenChange={openKeys => this.onNotificationChange(openKeys)}
          >
            <Menu.Item key="user" className="Topnav__item">
              <Link className="Topnav__user" to={`/@${username}`}>
                <Avatar username={username} size={36} />
                <span>{username}</span>
              </Link>
            </Menu.Item>
            <SubMenu
              key="notifications"
              className="Topnav__item Topnav__item--dropdown"
              title={
                <Popover visible={this.state.notificationsVisible} content={<span>Notifications</span>} title="Notifications"><span className="icon-beanie" /></Popover>
              }
            />
            <SubMenu key="more" className="Topnav__item Topnav__item--dropdown" title={<Icon type="ellipsis" />}>
              <Menu.Item key="more:1">Option 1</Menu.Item>
              <Menu.Item key="more:2">Option 2</Menu.Item>
            </SubMenu>
          </Menu>
        </div>);
    } else {
      content = (
        <div className="Topnav__menu-container">
          <Menu className="Topnav__menu" mode="horizontal">
            <Menu.Item key="signin" className="Topnav__item">
              <Link to="/signin">
                Sign in
              </Link>
            </Menu.Item>
            <Menu.Item key="divider" className="Topnav__item" disabled>
              |
            </Menu.Item>
            <Menu.Item key="signup" className="Topnav__item">
              <Link to="/signup">
                Sign up
              </Link>
            </Menu.Item>
          </Menu>
        </div>);
    }

    return (
      <div className="Topnav">
        <div className="Topnav__container">
          <span className="Topnav__brand">busy</span>
          <Input placeholder="Search..." className="Topnav__input" />
          {content}
        </div>
      </div>
    );
  }
}

export default Topnav;
