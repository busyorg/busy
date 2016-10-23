var React = require('react'),
  ReactRedux = require('react-redux'),
  actions = require('./actions'),
  bookmarksActions = require('./app/Bookmarks/bookmarksActions'),
  Sidebar = require('./app/Sidebar');

import * as authActions from './auth/authActions';

var Wrapper = React.createClass({
  componentWillMount() {
    this.props.login();
    this.props.getConfig();
    this.props.getBookmarks();
  },

  render() {
    var className = (!this.props.app.sidebarIsVisible) ? 'app-wrapper full-width' : 'app-wrapper';
    const { auth } = this.props;
    return (
      <div className={className}>
        <Sidebar />
        {
          React.cloneElement(
            this.props.children,
            { auth }
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
    }
  };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Wrapper);
