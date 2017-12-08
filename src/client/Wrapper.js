import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
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
import getTranslations, { getAvailableLocale } from './translations';

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

  componentDidMount() {
    this.props.login().then(() => this.props.getFollowing());
    this.props.getRewardFund();
    this.props.getRebloggedList();
    this.props.getRate();
    this.props.getTrendingTopics();
  }

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
    const { locale: appLocale, user } = this.props;

    const locale = getAvailableLocale(appLocale);
    const translations = getTranslations(appLocale);

    return (
      <IntlProvider key={locale} locale={locale} messages={translations}>
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
