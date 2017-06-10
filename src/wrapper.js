import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { IntlProvider } from "react-intl";
import { Layout } from "antd";
import { GatewayProvider, GatewayDest } from "react-gateway";
import { withRouter } from "react-router-dom";
import { login } from "./auth/authActions";
import { getConfig, getRate } from "./actions";
import steemAPI from "./steemAPI";
import { getMessages, getLocale } from "./translations/translationHelper";
import { getStoredBookmarks } from "./bookmarks/bookmarksActions";
import Notification from "./app/Notification/Notification";
import { LeftSidebar, RightSidebar } from "./app/Sidebar/index";
import Topnav from "./components/Navigation/Topnav";
import Hero from "./components/Hero";
import * as reblogActions from "./app/Reblog/reblogActions";
import config from "../config.json";
import "./translations/Translations";

const { Header, Content, Sider } = Layout;
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
    const path = `/${config.translations.parent_permlink}/@${config.translations
      .author}/${config.translations.permlink}`;
    steemAPI.getState(path, (err, result) => {
      this.setState({ messages: getMessages(result.content) });
    });
  };

  render() {
    const { messages } = this.state;
    const { app, auth } = this.props;
    const locale = getLocale(app.locale, messages);
    let translations = messages[app.locale || locale] || {};
    if (messages.en) {
      translations = { ...messages.en, ...translations };
    }

    return (
      <IntlProvider locale={locale} messages={translations}>
        <GatewayProvider>
          <Layout>
            <Header>
              <Topnav username={auth.user.name} />
            </Header>
            <Notification />
            {auth.user.name === undefined ? <Hero /> : <div />}
            <Layout>
              <Sider><LeftSidebar /></Sider>
              <Content>
                {this.props.children}
              </Content>
              <Sider><RightSidebar /></Sider>
            </Layout>
            <GatewayDest name="tooltip" />
            <GatewayDest name="popover" />
            <GatewayDest name="modal" />
          </Layout>
        </GatewayProvider>
      </IntlProvider>
    );
  }
}
