import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { GatewayProvider, GatewayDest } from 'react-gateway';
import { login } from './auth/authActions';
import { getConfig, getRate } from './actions';
import steemAPI from './steemAPI';
import { getMessages, getLocale } from './translations/translationHelper';
import { getStoredBookmarks } from './bookmarks/bookmarksActions';
import { notify } from './app/Notification/notificationActions';
import Notification from './app/Notification/Notification';
import Header from './app/Header';
import Sidebar from './app/Sidebar';
import * as reblogActions from './app/Reblog/reblogActions';
import config from '../config.json';
import './translations/Translations';

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

  /**
   * Load translations messages stored on Steem blockchain using comments:
   * https://busy.org/test/@siol/translations
   */
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
    let translations = messages[app.locale || locale] || {};
    if (messages.en) {
      translations = { ...messages.en, ...translations };
    }
    return (
      <IntlProvider locale={locale} messages={translations}>
        <GatewayProvider>
          <div className={className}>
            <Header />
            <Sidebar />
            <Notification />
            {React.cloneElement(
              this.props.children,
              { auth, notify }
            )}
            <GatewayDest name="tooltip" />
            <GatewayDest name="popover" />
            <GatewayDest name="modal" />
          </div>
        </GatewayProvider>
      </IntlProvider>
    );
  }
}
