import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import numeral from 'numeral';
import { Menu } from 'antd';
import './UserMenu.less';

class UserMenu extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    defaultKey: PropTypes.string,
    followers: PropTypes.number,
    following: PropTypes.number,
  };

  static defaultProps = {
    onChange: () => {},
    defaultKey: 'discussions',
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
              <FormattedMessage id="discussions" defaultMessage="Discussions" />
            </Menu.Item>
            <Menu.Item key="comments" className="UserMenu__item">
              <FormattedMessage id="comments" defaultMessage="Comments" />
            </Menu.Item>
            <Menu.Item key="followers" className="UserMenu__item">
              <FormattedMessage id="followers" defaultMessage="Followers" />
              <span className="UserMenu__badge">{followersValue}</span>
            </Menu.Item>
            <Menu.Item key="followed" className="UserMenu__item">
              <FormattedMessage id="following" defaultMessage="Following" />
              <span className="UserMenu__badge">{followingValue}</span>
            </Menu.Item>
          </Menu>
        </div>
      </div>
    );
  }
}

export default UserMenu;
