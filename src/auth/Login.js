import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import { FormattedMessage, injectIntl } from 'react-intl';
import config from '../../config.json';

@injectIntl
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      emailErrors: [],
      passwordErrors: [],
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
    fetch(`${config.api}/auth/login?email=${email}&password=${password}`)
      .then(res => res.json())
      .then((json) => {
        if (!json.token) {
          this.setState({
            emailErrors: json.email || [],
            passwordErrors: json.password || [],
          });
        } else {
          alert('Success!');
        }
      });
  };

  render() {
    const { emailErrors, passwordErrors } = this.state;
    return (
      <div className="main-panel">
        <h1 className="text-center my-5">
          <FormattedMessage id="login" defaultMessage="Log In" />
        </h1>
        <form
          onSubmit={this.onSubmit}
          className="container container-small"
        >
          <div className={emailErrors[0] ? 'form-group has-danger' : 'form-group'}>
            <input
              onChange={this.onEmailChange}
              type="email"
              className="form-control form-control-lg"
              placeholder={
                this.props.intl.formatMessage({ id: 'email', defaultMessage: 'Email address' })
              }
            />
            {emailErrors[0] &&
              <div className="form-control-feedback">{emailErrors[0]}</div>
            }
          </div>
          <div className={passwordErrors[0] ? 'form-group has-danger' : 'form-group'}>
            <input
              onChange={this.onPasswordChange}
              type="password"
              className="form-control form-control-lg"
              placeholder={
                this.props.intl.formatMessage({ id: 'password', defaultMessage: 'Password' })
              }
            />
            {passwordErrors[0] &&
              <div className="form-control-feedback">{passwordErrors[0]}</div>
            }
          </div>
          <div className="form-group">
            <span className="input-group-btn">
              <button type="submit" className="btn btn-primary btn-lg">
                <FormattedMessage id="login" defaultMessage="Log In" />
              </button>
            </span>
          </div>
        </form>
      </div>
    );
  }
}
