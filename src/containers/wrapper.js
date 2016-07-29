var React = require('react'),
    ReactRedux = require("react-redux"),
    actions = require("../actions"),
    Modal = require("./../containers/modal"),
    Loading = require("./../containers/loading");

var Wrapper = React.createClass({
    componentWillMount: function(){
        this.props.loginUser();
    },
    render: function() {
        return (
            <div className="app-wrapper">
                {!this.props.auth.isAuthenticated && <Loading />}
                {this.props.auth.isAuthenticated &&
                    <nav className="sidebar">
                        <div className="sidebar-header">
                            <div className="avatar"><img src={this.props.auth.user.picture} width="48" height="48" /></div>
                            <div>{this.props.auth.user.email}</div>
                        </div>
                        <div className="sidebar-footer"></div>
                    </nav>}
                {this.props.auth.isAuthenticated && <Modal />}
                {this.props.auth.isAuthenticated && this.props.children}
            </div>
        );
    }
});

var mapStateToProps = function(state){
    return {auth:state.auth};
};

var mapDispatchToProps = function(dispatch){
    return {
        loginUser: function(){ dispatch(actions.loginUser()); }
    }
};

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(Wrapper);