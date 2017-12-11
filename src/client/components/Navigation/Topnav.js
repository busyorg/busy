import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withRouter, Link } from 'react-router-dom';
import { Menu, Popover, Tooltip, Input } from 'antd';
import classNames from 'classnames';
import SteemConnect from '../../steemConnectAPI';
import Avatar from '../Avatar';
import PopoverMenu, { PopoverMenuItem } from '../PopoverMenu/PopoverMenu';
import './Topnav.less';

@injectIntl
@withRouter
class Topnav extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    username: PropTypes.string,
    onMenuItemClick: PropTypes.func,
  };

  static defaultProps = {
    username: undefined,
    onMenuItemClick: () => {},
  };

  state = {
    searchBarActive: false,
  };

  menuForLoggedOut = () => {
    const { location } = this.props;
    const next = location.pathname.length > 1 ? location.pathname : '';

    return (
      <div className="Topnav__menu-container">
        <Menu className="Topnav__menu-container__menu" mode="horizontal">
          <Menu.Item key="signup">
            <a target="_blank" rel="noopener noreferrer" href="https://steemit.com/pick_account">
              <FormattedMessage id="signup" defaultMessage="Sign up" />
            </a>
          </Menu.Item>
          <Menu.Item key="divider" disabled>
            |
          </Menu.Item>
          <Menu.Item key="login">
            <a href={SteemConnect.getLoginURL(next)}>
              <FormattedMessage id="login" defaultMessage="Log in" />
            </a>
          </Menu.Item>
        </Menu>
      </div>
    );
  };

  menuForLoggedIn = () => {
    const { intl, username, onMenuItemClick } = this.props;

    return (
      <div className="Topnav__menu-container">
        <Menu selectedKeys={[]} className="Topnav__menu-container__menu" mode="horizontal">
          <Menu.Item key="write">
            <Tooltip
              placement="bottom"
              title={intl.formatMessage({ id: 'write_post', defaultMessage: 'Write post' })}
            >
              <Link to="/editor" className="Topnav__link">
                <i className="iconfont icon-write" />
              </Link>
            </Tooltip>
          </Menu.Item>
          <Menu.Item key="user" className="Topnav__item-user">
            <Link className="Topnav__user" to={`/@${username}`}>
              <Avatar username={username} size={36} />
              <span className="Topnav__user__username">{username}</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="more">
            <Popover
              placement="bottom"
              trigger="click"
              content={
                <PopoverMenu onSelect={onMenuItemClick}>
                  <PopoverMenuItem key="my-profile" fullScreenHidden>
                    <FormattedMessage id="my_profile" defaultMessage="My profile" />
                  </PopoverMenuItem>
                  <PopoverMenuItem key="feed" fullScreenHidden>
                    <FormattedMessage id="feed" defaultMessage="Feed" />
                  </PopoverMenuItem>
                  <PopoverMenuItem key="news" fullScreenHidden>
                    <FormattedMessage id="news" defaultMessage="News" />
                  </PopoverMenuItem>
                  <PopoverMenuItem key="replies" fullScreenHidden>
                    <FormattedMessage id="replies" defaultMessage="Replies" />
                  </PopoverMenuItem>
                  <PopoverMenuItem key="wallet" fullScreenHidden>
                    <FormattedMessage id="wallet" defaultMessage="Wallet" />
                  </PopoverMenuItem>
                  <PopoverMenuItem key="activity">
                    <FormattedMessage id="activity" defaultMessage="Activity" />
                  </PopoverMenuItem>
                  <PopoverMenuItem key="bookmarks">
                    <FormattedMessage id="bookmarks" defaultMessage="Bookmarks" />
                  </PopoverMenuItem>
                  <PopoverMenuItem key="drafts">
                    <FormattedMessage id="drafts" defaultMessage="Drafts" />
                  </PopoverMenuItem>
                  <PopoverMenuItem key="settings">
                    <FormattedMessage id="settings" defaultMessage="Settings" />
                  </PopoverMenuItem>
                  <PopoverMenuItem key="logout">
                    <FormattedMessage id="logout" defaultMessage="Logout" />
                  </PopoverMenuItem>
                </PopoverMenu>
              }
            >
              <a className="Topnav__link Topnav__link--light">
                <i className="iconfont icon-switch" />
              </a>
            </Popover>
          </Menu.Item>
        </Menu>
      </div>
    );
  };

  content = () => (this.props.username ? this.menuForLoggedIn() : this.menuForLoggedOut());

  handleMobileSearchButtonClick = () => {
    const { searchBarActive } = this.state;
    this.setState({ searchBarActive: !searchBarActive }, () => {
      this.searchInputRef.refs.input.focus();
    });
  };

  render() {
    const { intl } = this.props;
    const { searchBarActive } = this.state;

    return (
      <div className="Topnav">
        <div className="topnav-layout container">
          <div className="left">
            <Link className="Topnav__brand" to="/">
              busy
            </Link>
            <span className="Topnav__version">beta</span>
          </div>
          <div className={classNames('center', { mobileVisible: searchBarActive })}>
            <div className="Topnav__input-container">
              <Input
                ref={(ref) => {
                  this.searchInputRef = ref;
                }}
                onPressEnter={event =>
                  window.open(
                    `https://www.google.com/search?q=${encodeURIComponent(
                      `site:steemit.com ${event.target.value}`,
                    )}`,
                  )
                }
                placeholder={intl.formatMessage({
                  id: 'search_placeholder',
                  defaultMessage: 'Search...',
                })}
              />
              <i className="iconfont icon-search" />
            </div>
          </div>
          <div className="right">
            {this.content()}
            <button className="Topnav__mobile-search" onClick={this.handleMobileSearchButtonClick}>
              <i
                className={classNames('iconfont', {
                  'icon-close': searchBarActive,
                  'icon-search': !searchBarActive,
                })}
              />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Topnav;
