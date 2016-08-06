var React = require('react'),
    ReactRedux = require("react-redux"),
    actions = require("../actions"),
    Modal = require("./../containers/modal"),
    Sidebar = require("./../containers/sidebar"),
    Loading = require("./../containers/loading"),
    Chat = require("./../containers/chat-trigger");

var Wrapper = React.createClass({
  componentWillMount: function(){
    this.props.login('fabien', '**********');
    this.props.getConfig();
  },
  render: function() {
      return (
        this.props.auth.isAuthenticated? <div className="app-wrapper">
          <Sidebar />
          <Modal />
          <Chat />
          {this.props.children}
        </div> : <Loading color="white" />
      );
  }
});

var mapStateToProps = function(state){
  return {
    auth: state.auth,
    pages: state.pages
  };
};

var mapDispatchToProps = function(dispatch){
  return {
    login: function(username, password){ dispatch(actions.login(username, password)); },
    getConfig: function(){ dispatch(actions.getConfig()); }
  }
};

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(Wrapper);