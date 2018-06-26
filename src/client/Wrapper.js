import React from 'react';
import PropTypes from 'prop-types';
import url from 'url';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { LocaleProvider, Layout } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import Cookie from 'js-cookie';
import { findLanguage, getRequestLocale, getBrowserLocale, loadLanguage } from './translations';
import {
  getIsLoaded,
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getLocale,
  getUsedLocale,
  getTranslations,
  getUseBeta,
} from './reducers';
import { login, logout, busyLogin } from './auth/authActions';
import { getFollowing, getNotifications } from './user/userActions';
import {
  getRate,
  getRewardFund,
  getTrendingTopics,
  setUsedLocale,
  setAppUrl,
} from './app/appActions';
import * as reblogActions from './app/Reblog/reblogActions';
import Redirect from './components/Utils/Redirect';
import NotificationPopup from './notifications/NotificationPopup';
import Topnav from './components/Navigation/Topnav';
import Transfer from './wallet/Transfer';
import BBackTop from './components/BBackTop';

@withRouter
@connect(
  state => ({
    loaded: getIsLoaded(state),
    user: getAuthenticatedUser(state),
    username: getAuthenticatedUserName(state),
    usedLocale: getUsedLocale(state),
    translations: getTranslations(state),
    locale: getLocale(state),
  }),
  {
    login,
    logout,
    getFollowing,
    getNotifications,
    getRate,
    getRewardFund,
    getTrendingTopics,
    busyLogin,
    getRebloggedList: reblogActions.getRebloggedList,
    setUsedLocale,
  },
)
export default class Wrapper extends React.PureComponent {
  static propTypes = {
    route: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    locale: PropTypes.string.isRequired,
    history: PropTypes.shape().isRequired,
    usedLocale: PropTypes.string,
    translations: PropTypes.shape(),
    username: PropTypes.string,
    login: PropTypes.func,
    logout: PropTypes.func,
    getFollowing: PropTypes.func,
    getRewardFund: PropTypes.func,
    getRebloggedList: PropTypes.func,
    getRate: PropTypes.func,
    getTrendingTopics: PropTypes.func,
    getNotifications: PropTypes.func,
    setUsedLocale: PropTypes.func,
    busyLogin: PropTypes.func,
  };

  static defaultProps = {
    usedLocale: null,
    translations: {},
    username: '',
    login: () => {},
    logout: () => {},
    getFollowing: () => {},
    getRewardFund: () => {},
    getRebloggedList: () => {},
    getRate: () => {},
    getTrendingTopics: () => {},
    getNotifications: () => {},
    setUsedLocale: () => {},
    busyLogin: () => {},
  };

  static async fetchData({ store, req, res }) {
    await store.dispatch(login());

    const appUrl = url.format({
      protocol: req.protocol,
      host: req.get('host'),
    });

    store.dispatch(setAppUrl(appUrl));

    const state = store.getState();

    const useBeta = getUseBeta(state);

    if (useBeta && appUrl === 'https://ulogs.org') {
      res.redirect(`https://staging.ulogs.org${req.originalUrl}`);
      return;
    }

    let activeLocale = getLocale(state);
    if (activeLocale === 'auto') {
      activeLocale = req.cookies.language || getRequestLocale(req.get('Accept-Language'));
    }

    const lang = await loadLanguage(activeLocale);

    store.dispatch(setUsedLocale(lang));
  }

  constructor(props) {
    super(props);

    this.loadLocale = this.loadLocale.bind(this);
    this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
  }

  componentDidMount() {
    this.props.login().then(() => {
      this.props.getFollowing();
      this.props.getNotifications();
      this.props.busyLogin();
    });

    this.props.getRewardFund();
    this.props.getRebloggedList();
    this.props.getRate();
    this.props.getTrendingTopics();
  }

  componentWillReceiveProps(nextProps) {
    const { locale } = this.props;

    if (locale !== nextProps.locale) {
      this.loadLocale(nextProps.locale);
    }
  }

  async loadLocale(locale) {
    let activeLocale = locale;
    if (activeLocale === 'auto') {
      activeLocale = Cookie.get('language') || getBrowserLocale();
    }

    const lang = await loadLanguage(activeLocale);

    this.props.setUsedLocale(lang);
  }

  handleMenuItemClick(key) {
    switch (key) {
      case 'logout':
        this.props.logout();
        break;
      case 'activity':
        this.props.history.push('/activity');
        break;
      case 'replies':
        this.props.history.push('/replies');
        break;
      case 'bookmarks':
        this.props.history.push('/bookmarks');
        break;
      case 'drafts':
        this.props.history.push('/drafts');
        break;
      case 'settings':
        this.props.history.push('/settings');
        break;
      case 'feed':
        this.props.history.push('/');
        break;
      case 'news':
        this.props.history.push('/trending');
        break;
      case 'wallet':
        this.props.history.push('/wallet');
        break;
      case 'my-profile':
        this.props.history.push(`/@${this.props.username}`);
        break;
      default:
        break;
    }
  }

  render() {
    const { user, usedLocale, translations } = this.props;

    const language = findLanguage(usedLocale);

    return (
      <IntlProvider key={language.id} locale={language.localeData} messages={translations}>
        <LocaleProvider locale={enUS}>
          <Layout data-dir={language && language.rtl ? 'rtl' : 'ltr'}>
            <Layout.Header style={{ position: 'fixed', width: '100%', zIndex: 1050 }}>
              <Topnav username={user.name} onMenuItemClick={this.handleMenuItemClick} />
            </Layout.Header>
            <div className="content">
              {renderRoutes(this.props.route.routes)}
              <Redirect />
              <Transfer />
              <NotificationPopup />
              <BBackTop />
            </div>
          </Layout>
        </LocaleProvider>
      </IntlProvider>
    );
  }
}
