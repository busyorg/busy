import React, { PropTypes } from 'react';
import numeral from 'numeral';
import { Menu } from 'antd';
import './UserMenu.less';

class UserMenu extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    defaultKey: PropTypes.string,
    discussions: PropTypes.number,
    comments: PropTypes.number,
    followers: PropTypes.number,
    following: PropTypes.number,
  };

  static defaultProps = {
    onChange: () => {},
    defaultKey: 'discussions',
    discussions: 0,
    comments: 0,
    followers: 0,
    following: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      current: props.defaultKey ? props.defaultKey : 'discussions',
    };
  }

  handleClick = (e) => {
    this.setState(
      {
        current: e.key,
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange(e.key);
        }
      },
    );
  };

  render() {
    const discussionsValue = numeral(this.props.discussions).format('0,0');
    const commentsValue = numeral(this.props.comments).format('0,0');
    const followersValue = numeral(this.props.followers).format('0,0');
    const followingValue = numeral(this.props.following).format('0,0');

    return (
      <div className="UserMenu">
        <div className="container topnav-layout">
          <div className="left" />
          <Menu
            className="UserMenu__menu center"
            onClick={this.handleClick}
            selectedKeys={[this.state.current]}
            mode="horizontal"
          >
            <Menu.Item key="discussions" className="UserMenu__item">
              Discussions
              <span className="UserMenu__badge">{discussionsValue}</span>
            </Menu.Item>
            <Menu.Item key="comments" className="UserMenu__item">
              <strong>
                Comments
                <span className="UserMenu__badge">{commentsValue}</span>
              </strong>
            </Menu.Item>
            <Menu.Item key="followers" className="UserMenu__item">
              <strong>
                Followers
                <span className="UserMenu__badge">{followersValue}</span>
              </strong>
            </Menu.Item>
            <Menu.Item key="followed" className="UserMenu__item">
              <strong>
                Following
                <span className="UserMenu__badge">{followingValue}</span>
              </strong>
            </Menu.Item>
          </Menu>
        </div>
      </div>
    );
  }
}

export default UserMenu;
