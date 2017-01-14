import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import numeral from 'numeral';
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
    const { location: { query } } = props;
    this.handleToChange = this.handleToChange.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleMemoChange = this.handleMemoChange.bind(this);
    this.state = {
      from: this.props.auth.user.name,
      to: query.to || '',
      memo: query.memo || '',
      amount: query.amount || '',
      currency: query.currency || 'STEEM',
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
    const account = this.props.auth.user;
    const { from, to, amount, currency, memo } = this.state;
    const balance = currency === 'STEEM' ? account.balance : account.sbd_balance;
    const url = `https://steemjs.com/sign/transfer?from=${from}&to=${to}&memo=${memo}&amount=${amount}%20${currency}`;
    return (
      <div className="main-panel">
        <Header />
        <div className="my-3 container container-small text-xs-center">
          <h1>Transfer</h1>
          <form>
            <div className="form-group text-xs-left">
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
                <span className="input-group-addon">
                  <a href="#">{ currency }</a>
                  { ' ' }
                  {
                    currency === 'STEEM'
                      ? <a onClick={() => this.setState({ currency: 'SBD' })}>SBD</a>
                      : <a onClick={() => this.setState({ currency: 'STEEM' })}>STEEM</a>
                  }
                </span>
              </div>
              <p>
                Balance{ ' ' }
                <a href="#" onClick={() => this.setState({ amount: numeral(balance).format('0.000') })}>
                  { numeral(balance).format('0,0.000') }
                </a>
                { ` ${currency}` }
              </p>
            </div>
            <div className="form-group text-xs-left">
              <blockquote>
                <input
                  value={memo}
                  onChange={this.handleMemoChange}
                  placeholder="Memo"
                  type="text"
                  className="form-control form-control-lg"
                />
              </blockquote>
            </div>
            <div className="form-group">
              <a
                href={url}
                className="btn btn-success btn-lg"
              >
                <FormattedMessage id="continue" />
              </a>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
