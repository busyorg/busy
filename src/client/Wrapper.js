import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { LocaleProvider, Layout } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import { getAvailableLocale, getTranslationsByLocale, getLocaleDirection } from './translations';
import {
  getIsLoaded,
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getLocale,
  getUsedLocale,
} from './reducers';
import { login, logout, busyLogin } from './auth/authActions';
import { getFollowing, getNotifications } from './user/userActions';
import { getRate, getRewardFund, getTrendingTopics, busyAPIHandler } from './app/appActions';
import * as reblogActions from './app/Reblog/reblogActions';
import busyAPI from './busyAPI';
import Redirect from './components/Utils/Redirect';
import NotificationPopup from './notifications/NotificationPopup';
import Topnav from './components/Navigation/Topnav';
import Transfer from './wallet/Transfer';

@withRouter
@connect(
  state => ({
    loaded: getIsLoaded(state),
    user: getAuthenticatedUser(state),
    username: getAuthenticatedUserName(state),
    usedLocale: getUsedLocale(state),
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
    busyAPIHandler,
    getRebloggedList: reblogActions.getRebloggedList,
  },
)
export default class Wrapper extends React.PureComponent {
  static propTypes = {
    route: PropTypes.shape().isRequired,
    loaded: PropTypes.bool.isRequired,
    user: PropTypes.shape().isRequired,
    locale: PropTypes.string.isRequired,
    usedLocale: PropTypes.string.isRequired,
    history: PropTypes.shape().isRequired,
    username: PropTypes.string,
    login: PropTypes.func,
    logout: PropTypes.func,
    getFollowing: PropTypes.func,
    getRewardFund: PropTypes.func,
    getRebloggedList: PropTypes.func,
    getRate: PropTypes.func,
    getTrendingTopics: PropTypes.func,
    getNotifications: PropTypes.func,
    busyLogin: PropTypes.func,
    busyAPIHandler: PropTypes.func,
  };

  static defaultProps = {
    username: '',
    login: () => {},
    logout: () => {},
    getFollowing: () => {},
    getRewardFund: () => {},
    getRebloggedList: () => {},
    getRate: () => {},
    getTrendingTopics: () => {},
    getNotifications: () => {},
    busyLogin: () => {},
    busyAPIHandler: () => {},
  };

  static fetchData(store) {
    return store.dispatch(login());
  }

  constructor(props) {
    super(props);

    this.state = {
      translations: global.translations,
    };

    this.loadLocale = this.loadLocale.bind(this);
    this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
  }

  componentDidMount() {
    const { loaded, locale, usedLocale } = this.props;

    this.props.login().then(() => {
      this.props.getFollowing();
      this.props.getNotifications();
      this.props.busyLogin();
    });

    this.props.getRewardFund();
    this.props.getRebloggedList();
    this.props.getRate();
    this.props.getTrendingTopics();

    if (usedLocale !== getAvailableLocale(locale) && loaded) {
      this.loadLocale(locale);
    }

    busyAPI.subscribe(this.props.busyAPIHandler);
  }

  componentWillReceiveProps(nextProps) {
    const { usedLocale } = this.props;

    if (usedLocale !== getAvailableLocale(nextProps.locale) && nextProps.loaded) {
      this.loadLocale(nextProps.locale);
    }
  }

  loadLocale(locale) {
    const availableLocale = getAvailableLocale(locale);
    const translationsLocale = getTranslationsByLocale(locale);

    const localeDataPromise = import(`react-intl/locale-data/${availableLocale}`);
    const translationsPromise = import(`./locales/${translationsLocale}.json`);

    Promise.all([localeDataPromise, translationsPromise]).then(([localeData, translations]) => {
      addLocaleData(localeData);
      this.setState({
        translations,
      });
    });
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
    const { user, usedLocale, locale } = this.props;
    const { translations } = this.state;

    return (
      <IntlProvider key={usedLocale} locale={usedLocale} messages={translations}>
        <LocaleProvider locale={enUS}>
          <Layout data-dir={getLocaleDirection(getAvailableLocale(locale))}>
            <Layout.Header style={{ position: 'fixed', width: '99vw', zIndex: 1050 }}>
              <Topnav username={user.name} onMenuItemClick={this.handleMenuItemClick} />
            </Layout.Header>
            <div className="content">
              {renderRoutes(this.props.route.routes)}
              <Redirect />
              <Transfer />
              <NotificationPopup />
            </div>
          </Layout>
        </LocaleProvider>
      </IntlProvider>
    );
  }
}
