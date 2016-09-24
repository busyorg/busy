var React = require('react'),
  ReactRedux = require('react-redux'),
  actions = require('./actions'),
  Sidebar = require('./app/sidebar');

import * as authActions from './auth/authActions';

var Wrapper = React.createClass({
  componentWillMount() {
    this.props.login();
    this.props.getConfig();
  },
  render() {
    var className = (!this.props.app.sidebarIsVisible) ? 'app-wrapper full-width' : 'app-wrapper';
    return (
      <div className={className}>
        <Sidebar />
        {this.props.children}
      </div>
    );
  }
});

const mapStateToProps = function ({ app }) {
  return { app };
};

const mapDispatchToProps = function (dispatch) {
  return {
    login: () => {
      dispatch(authActions.login());
    },
    getConfig: () => {
      dispatch(actions.getConfig());
    }
  };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Wrapper);
