let React = require('react'),
  ReactRedux = require('react-redux'),
  _ = require('lodash'),
  api = require('./../steemAPI'),
  moment = require('moment'),
  actions = require('../actions'),
  PageActions = require('./../app/PageActions'),
  Header = require('./../app/header'),
  Link = require('react-router').Link;

const Wallet = React.createClass({
  componentWillMount() {
    this.props.setMenu('secondary');
    this.setState({ account: {} });
    api.getAccounts([this.props.params.name], (err, accounts) => {
      this.setState({ account: accounts[0] });
    });
  },
  componentWillReceiveProps(nextProps) {
    this.props.setMenu('secondary');
    this.setState({ account: {} });
    api.getAccounts([this.props.params.name], (err, accounts) => {
      this.setState({ account: accounts[0] });
    });
  },
  render() {
    const username = this.props.params.name;
    return (
      <div className="main-panel">
        <PageActions params={this.props.params} />
        <Header account={username} />
        <div className="container">
          <center>
            <h1>Wallet</h1>
          </center>
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

const mapDispatchToProps = function (dispatch) {
  return {
    setMenu(menu) { dispatch(actions.setMenu(menu)); }
  };
};

module.exports = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Wallet);
