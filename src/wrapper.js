var React = require('react'),
  ReactRedux = require('react-redux'),
  actions = require('./actions'),
  bookmarksActions = require('./bookmarks/bookmarksActions'),
  Sidebar = require('./app/sidebar');

import * as authActions from './auth/authActions';
import { notify } from './notification/notificationActions';
import Notification from './notification/Notification';

var Wrapper = React.createClass({
  componentWillMount() {
    this.props.login();
    this.props.getConfig();
    this.props.getBookmarks();
  },

  render() {
    var className = (!this.props.app.sidebarIsVisible) ? 'app-wrapper full-width' : 'app-wrapper';
    const { auth, notify } = this.props;
    return (
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
    );
  }
});


const mapStateToProps = ({ app, auth }) => {
  return {
    app,
    auth
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    login: () => {
      dispatch(authActions.login());
    },
    getConfig: () => {
      dispatch(actions.getConfig());
    },
    getBookmarks: () => {
      dispatch(bookmarksActions.getBookmarks());
    },
    notify: (text) => {
      dispatch(notify(text));
    }
  };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Wrapper);
