import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { LocaleProvider, Layout } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import { getIsLoaded, getAuthenticatedUser, getAuthenticatedUserName, getLocale } from './reducers';

import { getAvailableLocale } from './translations';
import { login, logout } from './auth/authActions';
import { getFollowing } from './user/userActions';
import { getRate, getRewardFund, getTrendingTopics } from './app/appActions';
import * as reblogActions from './app/Reblog/reblogActions';
import Topnav from './components/Navigation/Topnav';
import Transfer from './wallet/Transfer';
import Loading from './components/Icon/Loading';

@withRouter
@connect(
  state => ({
    loaded: getIsLoaded(state),
    user: getAuthenticatedUser(state),
    username: getAuthenticatedUserName(state),
    locale: getLocale(state),
  }),
  {
    login,
    logout,
    getFollowing,
    getRate,
    getRewardFund,
    getTrendingTopics,
    getRebloggedList: reblogActions.getRebloggedList,
  },
)
export default class Wrapper extends React.PureComponent {
  static propTypes = {
    route: PropTypes.shape().isRequired,
    loaded: PropTypes.bool.isRequired,
    user: PropTypes.shape().isRequired,
    locale: PropTypes.string.isRequired,
    history: PropTypes.shape().isRequired,
    username: PropTypes.string,
    login: PropTypes.func,
    logout: PropTypes.func,
    getFollowing: PropTypes.func,
    getRewardFund: PropTypes.func,
    getRebloggedList: PropTypes.func,
    getRate: PropTypes.func,
    getTrendingTopics: PropTypes.func,
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
  };

  static fetchData(store) {
    return store.dispatch(login());
  }

  constructor(props) {
    super(props);

    this.state = {
      i18nLoaded: false,
      translations: {},
    };

    this.loadLocale = this.loadLocale.bind(this);
    this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
  }

  componentDidMount() {
    const { loaded, locale } = this.props;

    this.props.login().then(() => this.props.getFollowing());
    this.props.getRewardFund();
    this.props.getRebloggedList();
    this.props.getRate();
    this.props.getTrendingTopics();

    if (loaded) {
      this.loadLocale(getAvailableLocale(locale));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { loaded, locale } = this.props;

    if (loaded !== nextProps.loaded || locale !== nextProps.locale) {
      this.loadLocale(getAvailableLocale(nextProps.locale));
    }
  }

  loadLocale(locale) {
    const localeDataPromise = import(`react-intl/locale-data/${locale}`);
    const translationsPromise = import(`./locales/${locale}.json`);

    Promise.all([localeDataPromise, translationsPromise]).then(([localeData, translations]) => {
      addLocaleData(localeData);
      this.setState({
        i18nLoaded: true,
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
    const { locale, user } = this.props;
    const { i18nLoaded, translations } = this.state;

    if (!i18nLoaded) return <Loading />;

    const appLocale = getAvailableLocale(locale);

    return (
      <IntlProvider key={appLocale} locale={appLocale} messages={translations}>
        <LocaleProvider locale={enUS}>
          <Layout>
            <Layout.Header style={{ position: 'fixed', width: '100%', zIndex: 5 }}>
              <Topnav username={user.name} onMenuItemClick={this.handleMenuItemClick} />
            </Layout.Header>
            <div className="content">
              {renderRoutes(this.props.route.routes)}
              <Transfer />
            </div>
          </Layout>
        </LocaleProvider>
      </IntlProvider>
    );
  }
}
