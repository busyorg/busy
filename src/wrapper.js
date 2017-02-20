import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { Tooltip, actions as tooltipActions } from 'redux-tooltip';
import { login } from './auth/authActions';
import { getConfig, getRate } from './actions';
import { getStoredBookmarks } from './bookmarks/bookmarksActions';
import { notify } from './app/Notification/notificationActions';
import Notification from './app/Notification/Notification';
import Sidebar from './app/Sidebar';
import getMessageWithLocale from './translations/Translations';
import * as reblogActions from './app/Reblog/reblogActions';
import './user/profileTooltip/ProfileTooltip.scss';

@connect(
  state => ({
    app: state.app,
    auth: state.auth,
  }),
  dispatch => bindActionCreators({
    login,
    getConfig,
    notify,
    getRate,
    getStoredBookmarks,
    getRebloggedList: reblogActions.getRebloggedList,
    keepTooltip: tooltipActions.keep,
    hideTooltip: tooltipActions.hide,
  }, dispatch)
)
export default class Wrapper extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.login();
    this.props.getConfig();
    this.props.getStoredBookmarks();
    this.props.getRebloggedList();
    this.props.getRate();
  }

  render() {
    const { app, auth, notify } = this.props;
    const { messages, locale } = getMessageWithLocale(app.locale);
    const className = (!app.sidebarIsVisible) ? 'app-wrapper full-width' : 'app-wrapper';
    return (
      <IntlProvider locale={locale} messages={messages}>
        <div className={className}>
          <Sidebar />
          <Notification />
          <Tooltip
            name="userProfile"
            className="ProfileTooltipHolder"
            store={this.props.store}
            place="bottom"
            auto={false}
            onHover={() => this.props.keepTooltip({ name: 'userProfile' })}
            onLeave={() => this.props.hideTooltip({ name: 'userProfile' })}
          />
          <Tooltip />
          {React.cloneElement(
            this.props.children,
            { auth, notify }
          )}
        </div>
      </IntlProvider>
    );
  }
}
