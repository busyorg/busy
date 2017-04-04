import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import config from '../../config.json';

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  onEmailChange = (e) => {
    this.setState({ email: e.target.value });
  };

  onPasswordChange = (e) => {
    this.setState({ password: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    fetch(`${config.api}/auth/signup?email=${email}&password=${password}`)
      .then(res => res.json())
      .then((json) => {
        console.log(json);
      });
  };

  render() {
    return (
      <div className="main-panel">
        <h1 className="text-center my-5">
          Sign Up
        </h1>
        <form
          onSubmit={this.onSubmit}
          className="container container-small"
        >
          <div className="form-group">
            <input
              onChange={this.onEmailChange}
              type="email"
              className="form-control form-control-lg"
              placeholder="Enter email"
            />
          </div>
          <div className="form-group">
            <input
              onChange={this.onPasswordChange}
              type="password"
              className="form-control form-control-lg"
              placeholder="Password"
            />
          </div>
          <div className="form-group">
            <span className="input-group-btn">
              <button type="submit" className="btn btn-primary btn-lg">
                Sign Up
              </button>
            </span>
          </div>
        </form>
      </div>
    );
  }
}
