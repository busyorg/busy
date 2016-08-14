var React = require('react'),
    ReactRedux = require("react-redux"),
    actions = require("../actions"),
    Modal = require("./../containers/modal"),
    Sidebar = require("./../containers/sidebar");

var Wrapper = React.createClass({
  componentWillMount: function(){
    this.props.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoic2lvbCIsImlhdCI6MTQ3MTE0ODc2MiwiZXhwIjoxNDcxMjM1MTYyfQ.p5o0ecVxQSYmla0xGimlIWKBaFsSUKFZVdATXbAiexU');
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
    app: state.app,
    auth: state.auth,
    pages: state.pages
  };
};

var mapDispatchToProps = function(dispatch){
  return {
    login: function(username){ dispatch(actions.login(username)); },
    getConfig: function(){ dispatch(actions.getConfig()); }
  }
};

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(Wrapper);