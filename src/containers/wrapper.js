var React = require('react'),
    ReactRedux = require('react-redux'),
    api = require('./../steemAPI'),
    actions = require('../actions'),
    Sidebar = require('./../containers/sidebar');

var Wrapper = React.createClass({
  componentWillMount: function(){
    this.props.getConfig();
    this.props.login();
  },

  componentDidMount: function(){
    this.steemInterval = setInterval(function() {
      api.getDynamicGlobalProperties(function(err, result) {});
    }, 10000);
  },

  componentWillUnmount() {
    if(window.clearInterval) {
      clearInterval(this.steemInterval);
    }
  },

  render: function() {
      var className = (!this.props.app.sidebarIsVisible)? 'app-wrapper full-width' : 'app-wrapper';
      return (
        <div className={className}>
          {this.props.app.sidebarIsVisible && <Sidebar />}
          {this.props.children}
        </div>
      );
  }
});

var mapStateToProps = function(state){
  return {
    app: state.app
  };
};

var mapDispatchToProps = function(dispatch){
  return {
    login: function(){ dispatch(actions.login()); },
    getConfig: function(){ dispatch(actions.getConfig()); }
  }
};

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(Wrapper);
