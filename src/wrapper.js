import React from 'react';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { login } from './auth/authActions';
import { getConfig } from './actions';
import { getStoredBookmarks } from './bookmarks/bookmarksActions';
import { notify } from './app/Notification/notificationActions';
import Notification from './app/Notification/Notification';
import Sidebar from './app/Sidebar';
import * as messages from './translations/i18n';


var Wrapper = React.createClass({
  componentWillMount() {
    this.props.login();
    this.props.getConfig();
    this.props.getStoredBookmarks();
  },

  render() {
    const className = (!this.props.app.sidebarIsVisible) ? 'app-wrapper full-width' : 'app-wrapper';
    const { app, auth, notify } = this.props;
    return (
      <IntlProvider locale={app.locale} messages={messages[app.locale]}>
        <div className={className}>
          <Sidebar />
          <Notification />
          {React.cloneElement(
            this.props.children,
            { auth, notify }
          )}
        </div>
      </IntlProvider>
    );
  }
});


const mapStateToProps = ({ app, auth }) => {
  return {
    app,
    auth
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: () => { dispatch(login()); },
    getConfig: () => { dispatch(getConfig()); },
    notify: (text) => { dispatch(notify(text)); },
    getStoredBookmarks: () => { dispatch(getStoredBookmarks()); },
  };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(Wrapper);
