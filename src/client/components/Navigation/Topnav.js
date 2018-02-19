import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Menu, Popover, Tooltip, Input, AutoComplete, Badge } from 'antd';
import classNames from 'classnames';
import { searchAutoComplete } from '../../search/searchActions';
import { getAutoCompleteSearchResults } from '../../reducers';
import SteemConnect from '../../steemConnectAPI';
import Avatar from '../Avatar';
import PopoverMenu, { PopoverMenuItem } from '../PopoverMenu/PopoverMenu';
import Notifications from './Notifications/Notifications';
import './Topnav.less';

@injectIntl
@withRouter
@connect(
  state => ({
    autoCompleteSearchResults: getAutoCompleteSearchResults(state),
  }),
  {
    searchAutoComplete,
  },
)
class Topnav extends React.Component {
  static propTypes = {
    autoCompleteSearchResults: PropTypes.arrayOf(PropTypes.string),
    intl: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    username: PropTypes.string,
    notifications: PropTypes.arrayOf(PropTypes.shape()),
    searchAutoComplete: PropTypes.func.isRequired,
    onMenuItemClick: PropTypes.func,
    onNotificationClick: PropTypes.func,
    onSeeAllClick: PropTypes.func,
  };

  static defaultProps = {
    autoCompleteSearchResults: [],
    notifications: [
      {
        id: 0,
        read: false,
        date: '2018-02-02T16:17:42',
        payload: {
          user: 'fabien',
        },
        type: 'NOTIFICATION_FOLLOWING',
      },
      {
        id: 1,
        read: false,
        date: '2018-02-02T16:17:42',
        payload: {
          user: 'ekitcho',
          post_url: '/selfimprovement/@manifestmovement/life-lesson-7-days-of-sun-tzu-day-',
          post_title: 'Life Lessons 7 days of Sun Tzi',
        },
        type: 'NOTIFICATION_REPLY',
      },
      {
        id: 2,
        read: false,
        date: '2018-02-02T16:17:42',
        payload: {
          user: 'ekitcho',
          amount: '1000',
        },
        type: 'NOTIFICATION_TRANSFER',
      },
      {
        id: 3,
        read: false,
        date: '2018-02-02T16:17:42',
        payload: {
          user: 'ekitcho',
          post_url: '/selfimprovement/@manifestmovement/life-lesson-7-days-of-sun-tzu-day-',
          post_title: 'Life Lessons 7 days of Sun Tzi',
        },
        type: 'NOTIFICATION_MENTION',
      },
    ],
    username: undefined,
    onMenuItemClick: () => {},
    onNotificationClick: () => {},
    onSeeAllClick: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      searchBarActive: false,
      popoverVisible: false,
      searchBarValue: '',
    };
    this.handleMoreMenuSelect = this.handleMoreMenuSelect.bind(this);
    this.handleMoreMenuVisibleChange = this.handleMoreMenuVisibleChange.bind(this);
    this.handleSelectOnAutoCompleteDropdown = this.handleSelectOnAutoCompleteDropdown.bind(this);
    this.handleAutoCompleteSearch = this.handleAutoCompleteSearch.bind(this);
    this.handleSearchForInput = this.handleSearchForInput.bind(this);
    this.handleOnChangeForAutoComplete = this.handleOnChangeForAutoComplete.bind(this);
    this.hideAutoCompleteDropdown = this.hideAutoCompleteDropdown.bind(this);
  }

  handleMoreMenuSelect(key) {
    this.setState({ popoverVisible: false }, () => {
      this.props.onMenuItemClick(key);
    });
  }

  handleMoreMenuVisibleChange(visible) {
    this.setState({ popoverVisible: visible });
  }

  menuForLoggedOut = () => {
    const { location } = this.props;
    const { searchBarActive } = this.state;
    const next = location.pathname.length > 1 ? location.pathname : '';

    return (
      <div
        className={classNames('Topnav__menu-container', {
          'Topnav__mobile-hidden': searchBarActive,
        })}
      >
        <Menu className="Topnav__menu-container__menu" mode="horizontal">
          <Menu.Item key="signup">
            <a target="_blank" rel="noopener noreferrer" href={process.env.SIGNUP_URL}>
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
    const { intl, username, notifications, onNotificationClick, onSeeAllClick } = this.props;
    const { searchBarActive } = this.state;
    const { popoverVisible } = this.state;
    const notificationsCount =
      notifications && notifications.filter(notification => !notification.read).length;
    const displayBadge = notificationsCount > 0;
    return (
      <div
        className={classNames('Topnav__menu-container', {
          'Topnav__mobile-hidden': searchBarActive,
        })}
      >
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
          <Menu.Item key="notifications" className="Topnav__item--badge">
            <Tooltip
              placement="bottom"
              title={intl.formatMessage({ id: 'notifications', defaultMessage: 'Notifications' })}
            >
              <Popover
                placement="bottomRight"
                trigger="click"
                content={
                  <Notifications
                    notifications={notifications}
                    onClick={onNotificationClick}
                    onSeeAllClick={onSeeAllClick}
                  />
                }
                title={intl.formatMessage({ id: 'notifications', defaultMessage: 'Notifications' })}
              >
                <a className="Topnav__link Topnav__link--light">
                  {displayBadge ? (
                    <div className="Topnav__notifications-count">{notificationsCount}</div>
                  ) : (
                    <i className="iconfont icon-remind" />
                  )}
                </a>
              </Popover>
            </Tooltip>
          </Menu.Item>
          <Menu.Item key="user" className="Topnav__item-user">
            <Link className="Topnav__user" to={`/@${username}`}>
              <Avatar username={username} size={36} />
            </Link>
          </Menu.Item>
          <Menu.Item key="more">
            <Popover
              placement="bottom"
              trigger="click"
              visible={popoverVisible}
              onVisibleChange={this.handleMoreMenuVisibleChange}
              overlayStyle={{ position: 'fixed' }}
              content={
                <PopoverMenu onSelect={this.handleMoreMenuSelect}>
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
                <i className="iconfont icon-caretbottom" />
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

  hideAutoCompleteDropdown() {
    this.props.searchAutoComplete('');
  }

  handleSearchForInput(event) {
    const value = event.target.value;
    this.hideAutoCompleteDropdown();
    this.props.history.push({
      pathname: '/search',
      search: `q=${value}`,
      state: {
        query: value,
      },
    });
  }

  handleAutoCompleteSearch(value) {
    this.props.searchAutoComplete(value);
  }

  handleSelectOnAutoCompleteDropdown(value) {
    this.props.history.push(`/@${value}`);
  }

  handleOnChangeForAutoComplete(value) {
    this.setState({
      searchBarValue: value,
    });
  }

  render() {
    const { intl, autoCompleteSearchResults } = this.props;
    const { searchBarActive, searchBarValue } = this.state;

    const dropdownOptions = _.map(autoCompleteSearchResults, option => (
      <AutoComplete.Option key={option} value={option} className="Topnav__search-autocomplete">
        {option}
      </AutoComplete.Option>
    ));
    const formattedAutoCompleteDropdown = _.isEmpty(dropdownOptions)
      ? dropdownOptions
      : dropdownOptions.concat([
          <AutoComplete.Option disabled key="all" className="Topnav__search-all-results">
            <Link
              to={{
                pathname: '/search',
                search: `?q=${searchBarValue}`,
                state: { query: searchBarValue },
              }}
            >
              <span onClick={this.hideAutoCompleteDropdown} role="presentation">
                {intl.formatMessage(
                  {
                    id: 'search_all_results_for',
                    defaultMessage: 'Search all results for {search}',
                  },
                  { search: searchBarValue },
                )}
              </span>
            </Link>
          </AutoComplete.Option>,
        ]);

    return (
      <div className="Topnav">
        <div className="topnav-layout">
          <div className={classNames('left', { 'Topnav__mobile-hidden': searchBarActive })}>
            <Link className="Topnav__brand" to="/">
              <i className="iconfont icon-busy Topnav__brand-icon" />
              busy
            </Link>
            <span className="Topnav__version">beta</span>
          </div>
          <div className={classNames('center', { mobileVisible: searchBarActive })}>
            <div className="Topnav__input-container">
              <AutoComplete
                dropdownClassName="Topnav__search-dropdown-container"
                dataSource={formattedAutoCompleteDropdown}
                onSearch={this.handleAutoCompleteSearch}
                onSelect={this.handleSelectOnAutoCompleteDropdown}
                onChange={this.handleOnChangeForAutoComplete}
                defaultActiveFirstOption={false}
                dropdownMatchSelectWidth={false}
                optionLabelProp="value"
                value={searchBarValue}
              >
                <Input
                  ref={ref => {
                    this.searchInputRef = ref;
                  }}
                  onPressEnter={this.handleSearchForInput}
                  placeholder={intl.formatMessage({
                    id: 'search_placeholder',
                    defaultMessage: 'What are you looking for?',
                  })}
                  autoCapitalize="off"
                  autoCorrect="off"
                />
              </AutoComplete>
              <i className="iconfont icon-search" />
            </div>
          </div>
          <div className="right">
            <button
              className={classNames('Topnav__mobile-search', {
                'Topnav__mobile-search-close': searchBarActive,
              })}
              onClick={this.handleMobileSearchButtonClick}
            >
              <i
                className={classNames('iconfont', {
                  'icon-close': searchBarActive,
                  'icon-search': !searchBarActive,
                })}
              />
            </button>
            {this.content()}
          </div>
        </div>
      </div>
    );
  }
}

export default Topnav;
