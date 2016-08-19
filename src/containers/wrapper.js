var React = require('react'),
    ReactRedux = require("react-redux"),
    actions = require("../actions"),
    Modal = require("./../containers/modal"),
    Sidebar = require("./../containers/sidebar");

var Wrapper = React.createClass({
  componentWillMount: function(){
    this.props.getConfig();
  },
  render: function() {
      var className = (!this.props.app.sidebarIsVisible)? 'app-wrapper full-width' : 'app-wrapper';
      return (
        <div className={className}>
          {this.props.app.sidebarIsVisible && <Sidebar />}
          <Modal />
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
    getConfig: function(){ dispatch(actions.getConfig()); }
  }
};

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(Wrapper);