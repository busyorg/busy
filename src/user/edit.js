let React = require('react'),
  ReactRedux = require('react-redux'),
  Header = require('./../app/header'),
  Link = require('react-router').Link;

const Edit = React.createClass({
  render() {
    return (
      <div className="main-panel">
        <Header account={this.props.auth.user.name} />
        <div className="page">
          <div className="block">
            <h1>Edit Profile</h1>
            <p><a href="https://steemconnect.com/logout" target="_blank">Log Out</a></p>
          </div>
        </div>
      </div>
    );
  }
});

const mapStateToProps = function (state) {
  return {
    auth: state.auth
  };
};

module.exports = ReactRedux.connect(mapStateToProps)(Edit);
