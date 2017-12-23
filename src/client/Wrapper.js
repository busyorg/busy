import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { LocaleProvider, Layout } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

import { getAuthenticatedUser, getAuthenticatedUserName, getLocale } from './reducers';

import { login, logout } from './auth/authActions';
import { getFollowing } from './user/userActions';
import { getRate, getRewardFund, getTrendingTopics } from './app/appActions';
import Topnav from './components/Navigation/Topnav';
import Transfer from './wallet/Transfer';
import * as reblogActions from './app/Reblog/reblogActions';

@withRouter
@connect(
  state => ({
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

  state = {
    locale: '',
    loading: true,
    translations: {},
  };

  componentDidMount() {
    this.props.login().then(() => this.props.getFollowing());
    this.props.getRewardFund();
    this.props.getRebloggedList();
    this.props.getRate();
    this.props.getTrendingTopics();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.locale !== this.props.locale) {
      this.setState({ locale: this.getAvailableLocale(nextProps.locale) });
      import(`react-intl/locale-data/${this.getAvailableLocale(nextProps.locale)}`).then((localeData) => {
        addLocaleData(localeData);
        import(`./locales/${this.getAvailableLocale(nextProps.locale)}.json`).then((data) => {
          this.setState({ translations: data, loading: false });
        });
      });
    }
  }

  getAvailableLocale = (appLocale) => {
    let locale = appLocale || 'auto';

    if (locale === 'auto') {
      locale = this.getBrowserLocale() || 'en';
    }

    return locale;
  };

  getBrowserLocale = () => {
    let detectedLocale;
    if (typeof navigator !== 'undefined') {
      detectedLocale =
        navigator.userLanguage ||
        navigator.language ||
        (navigator.languages && navigator.languages[0] ? navigator.languages[0] : undefined);
    }
    if (detectedLocale) {
      return detectedLocale.slice(0, 2);
    }
    return undefined;
  };

  handleMenuItemClick = (key) => {
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
  };

  render() {
    const { user } = this.props;

    if (this.state.loading) {
      return null;
    }

    return (
      <IntlProvider
        key={this.state.locale}
        locale={this.state.locale}
        messages={this.state.translations}
      >
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
