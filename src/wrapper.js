import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { GatewayProvider, GatewayDest } from 'react-gateway';
import { withRouter } from 'react-router-dom';
import { login } from './auth/authActions';
import { getConfig, getRate } from './actions';
import steemAPI from './steemAPI';
import { getMessages, getLocale } from './translations/translationHelper';
import { getStoredBookmarks } from './bookmarks/bookmarksActions';
import Notification from './app/Notification/Notification';
import { LeftSidebar, RightSidebar } from './app/Sidebar/index';
import Header from './app/Header';
import { notify } from './app/Notification/notificationActions';
import * as reblogActions from './app/Reblog/reblogActions';
import config from '../config.json';
import './translations/Translations';

@withRouter
@connect(
  state => ({
    app: state.app,
    auth: state.auth
  }),
  {
    login,
    getConfig,
    getRate,
    notify,
    getStoredBookmarks,
    getRebloggedList: reblogActions.getRebloggedList
  }
)
export default class Wrapper extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      messages: {}
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
    const path = `/${config.translations.parent_permlink}/@${config.translations.author}/${config
      .translations.permlink}`;
    steemAPI.getState(path, (err, result) => {
      this.setState({ messages: getMessages(result.content) });
    });
  };

  render() {
    const { messages } = this.state;
    const { app, auth } = this.props;
    const locale = getLocale(app.locale, messages);
    const className = 'app-wrapper full-width';
    let translations = messages[app.locale || locale] || {};
    if (messages.en) {
      translations = { ...messages.en, ...translations };
    }

    return (
      <IntlProvider locale={locale} messages={translations}>
        <GatewayProvider>
          <div className={className}>
            <Header />
            <Notification />
            <LeftSidebar />
            {React.cloneElement(this.props.children, { auth, notify })}
            <RightSidebar />
            <GatewayDest name="tooltip" />
            <GatewayDest name="popover" />
            <GatewayDest name="modal" />
          </div>
        </GatewayProvider>
      </IntlProvider>
    );
  }
}
