import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Menu, Popover, Tooltip, Input, AutoComplete } from 'antd';
import classNames from 'classnames';
import { searchAutoComplete } from '../../search/searchActions';
import { getUpdatedSCUserMetadata } from '../../auth/authActions';
import {
  getAutoCompleteSearchResults,
  getNotifications,
  getAuthenticatedUserSCMetaData,
  getIsLoadingNotifications,
} from '../../reducers';
import SteemConnect from '../../steemConnectAPI';
import { PARSED_NOTIFICATIONS } from '../../../common/constants/notifications';
import Avatar from '../Avatar';
import PopoverMenu, { PopoverMenuItem } from '../PopoverMenu/PopoverMenu';
import Notifications from './Notifications/Notifications';
import LanguageSettings from './LanguageSettings';
import './Topnav.less';

@injectIntl
@withRouter
@connect(
  state => ({
    autoCompleteSearchResults: getAutoCompleteSearchResults(state),
    notifications: getNotifications(state),
    userSCMetaData: getAuthenticatedUserSCMetaData(state),
    loadingNotifications: getIsLoadingNotifications(state),
  }),
  {
    searchAutoComplete,
    getUpdatedSCUserMetadata,
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
    getUpdatedSCUserMetadata: PropTypes.func.isRequired,
    onMenuItemClick: PropTypes.func,
    userSCMetaData: PropTypes.shape(),
    loadingNotifications: PropTypes.bool,
  };

  static defaultProps = {
    autoCompleteSearchResults: [],
    notifications: [],
    username: undefined,
    onMenuItemClick: () => {},
    userSCMetaData: {},
    loadingNotifications: false,
  };

  static handleScrollToTop() {
    if (window) {
      window.scrollTo(0, 0);
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      searchBarActive: false,
      popoverVisible: false,
      searchBarValue: '',
      notificationsPopoverVisible: false,
    };
    this.handleMoreMenuSelect = this.handleMoreMenuSelect.bind(this);
    this.handleMoreMenuVisibleChange = this.handleMoreMenuVisibleChange.bind(this);
    this.handleNotificationsPopoverVisibleChange = this.handleNotificationsPopoverVisibleChange.bind(
      this,
    );
    this.handleCloseNotificationsPopover = this.handleCloseNotificationsPopover.bind(this);
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

  handleNotificationsPopoverVisibleChange(visible) {
    if (visible) {
      this.setState({ notificationsPopoverVisible: visible });
    } else {
      this.handleCloseNotificationsPopover();
    }
  }

  handleCloseNotificationsPopover() {
    this.setState({
      notificationsPopoverVisible: false,
    });
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
          <Menu.Item key="language">
            <LanguageSettings />
          </Menu.Item>
        </Menu>
      </div>
    );
  };

  menuForLoggedIn = () => {
    const { intl, username, notifications, userSCMetaData, loadingNotifications } = this.props;
    const { searchBarActive, notificationsPopoverVisible, popoverVisible } = this.state;
    const lastSeenTimestamp = _.get(userSCMetaData, 'notifications_last_timestamp');
    const notificationsCount = _.isUndefined(lastSeenTimestamp)
      ? _.size(notifications)
      : _.size(
          _.filter(
            notifications,
            notification =>
              lastSeenTimestamp < notification.timestamp &&
              _.includes(PARSED_NOTIFICATIONS, notification.type),
          ),
        );
    const displayBadge = notificationsCount > 0;
    const notificationsCountDisplay = notificationsCount > 99 ? '99+' : notificationsCount;
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
              mouseEnterDelay={1}
            >
              <Link to="/editor" className="Topnav__link Topnav__link--action">
                <i className="iconfont icon-write" />
              </Link>
            </Tooltip>
          </Menu.Item>
          <Menu.Item key="notifications" className="Topnav__item--badge">
            <Tooltip
              placement="bottom"
              title={intl.formatMessage({ id: 'notifications', defaultMessage: 'Notifications' })}
              overlayClassName="Topnav__notifications-tooltip"
              mouseEnterDelay={1}
            >
              <Popover
                placement="bottomRight"
                trigger="click"
                content={
                  <Notifications
                    notifications={notifications}
                    onNotificationClick={this.handleCloseNotificationsPopover}
                    currentAuthUsername={username}
                    lastSeenTimestamp={lastSeenTimestamp}
                    loadingNotifications={loadingNotifications}
                    getUpdatedSCUserMetadata={this.props.getUpdatedSCUserMetadata}
                  />
                }
                visible={notificationsPopoverVisible}
                onVisibleChange={this.handleNotificationsPopoverVisibleChange}
                overlayClassName="Notifications__popover-overlay"
                title={intl.formatMessage({ id: 'notifications', defaultMessage: 'Notifications' })}
              >
                <a className="Topnav__link Topnav__link--light Topnav__link--action">
                  {displayBadge ? (
                    <div className="Topnav__notifications-count">{notificationsCountDisplay}</div>
                  ) : (
                    <i className="iconfont icon-remind" />
                  )}
                </a>
              </Popover>
            </Tooltip>
          </Menu.Item>
          <Menu.Item key="user" className="Topnav__item-user">
            <Link className="Topnav__user" to={`/@${username}`} onClick={Topnav.handleScrollToTop}>
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
      this.searchInputRef.input.focus();
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

  debouncedSearch = _.debounce(value => this.props.searchAutoComplete(value), 300);

  handleAutoCompleteSearch(value) {
    this.debouncedSearch(value);
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
