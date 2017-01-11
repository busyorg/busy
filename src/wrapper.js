import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { Tooltip, actions as tooltipActions } from 'redux-tooltip';

import { login } from './auth/authActions';
import { getConfig, getRate } from './actions';
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
    getRate,
    getStoredBookmarks,
    getRebloggedList: reblogActions.getRebloggedList,
    keepTooltip: tooltipActions.keep,
    hideTooltip: tooltipActions.hide,
  }, dispatch)
)

export default class Wrapper extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.login();
    this.props.getConfig();
    this.props.getStoredBookmarks();
    this.props.getRebloggedList();
    this.props.getRate();
  }

  render() {
    const { app, auth, notify } = this.props;
    const className = (!app.sidebarIsVisible) ? 'app-wrapper full-width' : 'app-wrapper';
    return (
      <IntlProvider locale={app.locale} messages={messages[app.locale]}>
        <div>
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
          <Tooltip
            name="userProfile"
            store={this.props.store}
            place="right"
            onHover={() => this.props.keepTooltip({ name: 'userProfile' })}
            onLeave={() => this.props.hideTooltip({ name: 'userProfile' })}
          />
        </div>
      </IntlProvider>
    );
  }
}
