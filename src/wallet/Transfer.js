import React, { Component } from 'react';
import { connect } from 'react-redux';
import steem from 'steem';
import Icon from '../widgets/Icon';
import Header from '../app/Header';

@connect(
  state => ({
    auth: state.auth,
  })
)

export default class Transfer extends Component {
  constructor(props) {
    super(props);
    this.handleToChange = this.handleToChange.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleMemoChange = this.handleMemoChange.bind(this);
    this.state = {
      from: this.props.auth.user.name,
      to: '',
      memo: '',
      amount: '',
    };
  }

  handleToChange = (event) => {
    this.setState({ to: event.target.value.toLowerCase() });
  };

  handleAmountChange = (event) => {
    this.setState({ amount: event.target.value });
  };

  handleMemoChange = (event) => {
    this.setState({ memo: event.target.value });
  };

  render() {
    const { from, to, amount, memo } = this.state;
    const url = `https://steemjs.com/sign/transfer?from=${from}&to=${to}&memo=${memo}&amount=${amount}`;
    return (
      <div className="main-panel">
        <Header />
        <div className="my-3 container container-small text-xs-center">
          <h1>Transfer</h1>
          <form>
            <div className="form-group">
              <div className="input-group">
                <span className="input-group-addon">
                  <Icon name="perm_identity" sm />
                </span>
                <input
                  autoFocus
                  value={to}
                  onChange={this.handleToChange}
                  placeholder="To"
                  type="text"
                  className="form-control form-control-lg"
                />
              </div>
              <div className="input-group">
                <span className="input-group-addon">
                  <Icon name="attach_money" sm />
                </span>
                <input
                  value={amount}
                  onChange={this.handleAmountChange}
                  placeholder="Amount"
                  type="text"
                  className="form-control form-control-lg"
                />
              </div>
              <input
                value={memo}
                onChange={this.handleMemoChange}
                placeholder="Memo"
                type="text"
                className="form-control form-control-lg"
              />
            </div>
            <div className="form-group">
              <a
                href={url}
                target="_blank"
                className="btn btn-success btn-lg"
              >
                Continue
              </a>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
