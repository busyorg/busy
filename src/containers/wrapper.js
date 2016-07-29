var React = require('react'),
    ReactRedux = require("react-redux"),
    actions = require("../actions"),
    Modal = require("./../containers/modal"),
    Sidebar = require("./../containers/sidebar");

module.exports = React.createClass({
    render: function() {
        return (
            <div className="app-wrapper">
                <Sidebar />
                <Modal />
                {this.props.children}
            </div>
        );
    }
});