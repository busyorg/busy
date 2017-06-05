import React, { PropTypes } from 'react';
import { Menu } from 'antd';
import './UserMenu.less';

class UserMenu extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      current: 'discussions',
    };
  }

  handleClick = (e) => {
    this.setState({
      current: e.key,
    }, () => {
      if (this.props.onChange) {
        this.props.onChange(e.key);
      }
    });
  }

  render() {
    return (
      <div className="UserMenu">
        <Menu
          className="UserMenu__menu"
          onClick={this.handleClick}
          selectedKeys={[this.state.current]}
          mode="horizontal"
        >
          <Menu.Item key="discussions" className="UserMenu__item">
            Discussions
            <span className="UserMenu__badge">765</span>
          </Menu.Item>
          <Menu.Item key="comments" className="UserMenu__item">
            <strong>
              Comments
              <span className="UserMenu__badge">54</span>
            </strong>
          </Menu.Item>
          <Menu.Item key="followers" className="UserMenu__item">
            <strong>
              Followers
              <span className="UserMenu__badge">1,350</span>
            </strong>
          </Menu.Item>
          <Menu.Item key="following" className="UserMenu__item">
            <strong>
              Following
              <span className="UserMenu__badge">250</span>
            </strong>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default UserMenu;
