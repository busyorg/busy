var React = require('react'),
	ReactRedux = require('react-redux'),
	Header = require("./../app/header"),
	Link = require('react-router').Link;

import * as authActions from './authActions';

var Callback = React.createClass({
  componentWillMount: function(){
    var username = this.props.params.name;
    this.props.dispatch(
      authActions.login(username)
    );
	},
  render: function(){
    return (
      <div className="main-panel">
        <Header />
        <section className="align-center">
          <div className="pal">
            <Link to="/" className="btn btn-primary btn-lg">Start</Link>
          </div>
        </section>
      </div>
    );
  }
});

module.exports = ReactRedux.connect()(Callback);
