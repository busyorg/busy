import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { Layout } from 'antd';
import { withRouter } from 'react-router-dom';

import { getAuthenticatedUser, getLocale } from './reducers';

import { login, logout } from './auth/authActions';
import { getConfig, getRate, getTrendingTopics } from './app/appActions';
import Topnav from './components/Navigation/Topnav';
import Transfer from './wallet/Transfer';
import * as reblogActions from './app/Reblog/reblogActions';
import getTranslations, { getAvailableLocale } from './translations';

@withRouter
@connect(
  state => ({
    user: getAuthenticatedUser(state),
    locale: getLocale(state),
  }),
  {
    login,
    logout,
    getConfig,
    getRate,
    getTrendingTopics,
    getRebloggedList: reblogActions.getRebloggedList,
  },
)
export default class Wrapper extends React.PureComponent {
  static propTypes = {
    user: PropTypes.shape().isRequired,
    locale: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
    history: PropTypes.shape().isRequired,
    login: PropTypes.func,
    logout: PropTypes.func,
    getConfig: PropTypes.func,
    getRebloggedList: PropTypes.func,
    getRate: PropTypes.func,
    getTrendingTopics: PropTypes.func,
  }

  static defaultProps = {
    login: () => {},
    logout: () => {},
    getConfig: () => {},
    getRebloggedList: () => {},
    getRate: () => {},
    getTrendingTopics: () => {},
  }

  componentWillMount() {
    this.props.login();
    this.props.getConfig();
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
        window.open(`https://steemd.com/@${this.props.user.name}`);
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
      default:
        break;
    }
  };

  render() {
    const { locale: appLocale, user } = this.props;

    const locale = getAvailableLocale(appLocale);
    const translations = getTranslations(appLocale);

    return (
      <IntlProvider locale={locale} messages={translations}>
        <Layout>
          <Layout.Header style={{ position: 'fixed', width: '100%', zIndex: 5 }}>
            <Topnav username={user.name} onMenuItemClick={this.handleMenuItemClick} />
          </Layout.Header>
          <div className="content">
            {this.props.children}
            <Transfer />
          </div>
        </Layout>
      </IntlProvider>
    );
  }
}
