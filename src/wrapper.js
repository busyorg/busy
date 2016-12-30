import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';

import { login } from './auth/authActions';
import { getConfig } from './actions';
import { getStoredBookmarks } from './bookmarks/bookmarksActions';
import { notify } from './app/Notification/notificationActions';
import Notification from './app/Notification/Notification';
import Sidebar from './app/Sidebar';
import Splash from './app/Splash';
import Loading from './widgets/Loading';
import Modal from './widgets/Modal';
import * as messages from './translations/Translations';
import * as reblogActions from './app/Reblog/reblogActions';

@connect(
  state => ({
    app: state.app,
    auth: state.auth,
  }),
  dispatch => bindActionCreators({
    login,
    getConfig,
    notify,
    getStoredBookmarks,
    getRebloggedList: reblogActions.getRebloggedList,
  }, dispatch)
)

export default class Wrapper extends Component {
  componentWillMount() {
    this.props.login();
    this.props.getConfig();
    this.props.getStoredBookmarks();
    this.props.getRebloggedList();
  }

  render() {
    const { app, auth, notify } = this.props;
    const className = (!app.sidebarIsVisible) ? 'app-wrapper full-width' : 'app-wrapper';
    return (
      <IntlProvider locale={app.locale} messages={messages[app.locale]}>
        { auth.isFetching ?
          <Modal>
            <Loading />
          </Modal>
          : auth.isAuthenticated
            ? <div className={className}>
              <Sidebar />
              <Notification />
              {React.cloneElement(
                this.props.children,
                { auth, notify }
              )}
            </div>
            : <Splash />
        }
      </IntlProvider>
    );
  }
}
