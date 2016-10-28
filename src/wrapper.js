import { IntlProvider } from 'react-intl';
import locales from './languages/locales';

import { login } from './auth/authActions';
import { getConfig } from './actions';
import { getBookmarks } from './app/Bookmarks/bookmarksActions';
import { notify } from './app/Notification/notificationActions';
import Notification from './app/Notification/Notification';
import Sidebar from './app/Sidebar';

var React = require('react'),
  ReactRedux = require('react-redux');

var Wrapper = React.createClass({
  componentWillMount() {
    this.props.login();
    this.props.getConfig();
    this.props.getBookmarks();
  },

  render() {
    const className = (!this.props.app.sidebarIsVisible) ? 'app-wrapper full-width' : 'app-wrapper';
    const { auth, notify } = this.props;
    return (
      <IntlProvider locale="en" messages={locales.en}>
        <div className={className}>
          <Sidebar />
          <Notification />
          {
            React.cloneElement(
              this.props.children,
              { auth, notify }
            )
          }
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
    getBookmarks: () => { dispatch(getBookmarks()); },
    notify: (text) => { dispatch(notify(text)); }
  };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Wrapper);
