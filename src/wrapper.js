import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { Tooltip, actions as tooltipActions } from 'redux-tooltip';
import { login } from './auth/authActions';
import { getConfig, getRate } from './actions';
import steemAPI from './steemAPI';
import { getMessages, getLocale } from './translations/translationHelper';
import { getStoredBookmarks } from './bookmarks/bookmarksActions';
import { notify } from './app/Notification/notificationActions';
import Notification from './app/Notification/Notification';
import Sidebar from './app/Sidebar';
import * as reblogActions from './app/Reblog/reblogActions';
import config from '../config.json';
import './translations/Translations';
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
    this.state = {
      messages: {},
    };
  }

  componentWillMount() {
    this.props.login();
    this.props.getConfig();
    this.props.getStoredBookmarks();
    this.props.getRebloggedList();
    this.props.getRate();
    this.loadMessages();
  }

  loadMessages = () => {
    const path = `/${config.translations.parent_permlink}/@${config.translations.author}/${config.translations.permlink}`;
    steemAPI.getState(path, (err, result) => {
      this.setState({ messages: getMessages(result.content) });
    });
  };

  render() {
    const { messages } = this.state;
    const { app, auth, notify } = this.props;
    const locale = getLocale(app.locale, messages);
    const className = (!app.sidebarIsVisible) ? 'app-wrapper full-width' : 'app-wrapper';
    return (
      <IntlProvider locale={locale} messages={messages[app.locale || locale] || {}}>
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
