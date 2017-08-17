import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import numeral from 'numeral';
import Textarea from 'react-textarea-autosize';

import { getAuthenticatedUser } from '../reducers';

@connect(state => ({
  user: getAuthenticatedUser(state),
}))
export default class Transfer extends React.Component {
  static propTypes = {
    user: PropTypes.shape().isRequired,
    location: PropTypes.shape(),
  };

  static defaultProps = {
    location: {},
  };

  constructor(props) {
    super(props);
    const { location: { query } } = props;
    this.handleToChange = this.handleToChange.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleMemoChange = this.handleMemoChange.bind(this);
    this.state = {
      from: this.props.user.name,
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
    const account = this.props.user;
    const { from, to, amount, currency, memo } = this.state;
    const balance = currency === 'STEEM' ? account.balance : account.sbd_balance;
    const url = `https://v2.steemconnect.com/sign/transfer?from=${from}&to=${to}&memo=${memo}&amount=${amount}%20${currency}`;
    const sbdBtnClass = classNames('btn btn-sm mr-2', {
      'btn-primary': currency === 'SBD',
      'btn-secondary': currency === 'STEEM',
    });
    const steemBtnClass = classNames('btn btn-sm mr-2', {
      'btn-primary': currency === 'STEEM',
      'btn-secondary': currency === 'SBD',
    });
    return (
      <div className="main-panel">
        <div className="my-5 container container-small text-center">
          <h1>Transfer</h1>
          <form>
            <div className="form-group">
              <div className="input-group">
                <input
                  value={to}
                  autoComplete="off"
                  onChange={this.handleToChange}
                  placeholder="To"
                  type="text"
                  className="form-control form-control-lg"
                />
              </div>
              <div className="input-group">
                <input
                  value={amount}
                  onChange={this.handleAmountChange}
                  placeholder="Amount"
                  type="text"
                  className="form-control form-control-lg"
                />
                <span className="input-group-addon">
                  <div>
                    <a
                      role="presentation"
                      className={sbdBtnClass}
                      onClick={() => this.setState({ currency: 'SBD' })}
                    >
                      SBD
                    </a>
                    <a
                      role="presentation"
                      className={steemBtnClass}
                      onClick={() => this.setState({ currency: 'STEEM' })}
                    >
                      STEEM
                    </a>
                  </div>
                </span>
              </div>
              <h4 className="my-2">
                Balance{' '}
                <a
                  role="presentation"
                  onClick={() => this.setState({ amount: numeral(balance).format('0.000') })}
                >
                  {numeral(balance).format('0,0.000')}
                </a>
                {` ${currency}`}
              </h4>
            </div>
            <div className="form-group">
              <blockquote>
                <Textarea
                  value={memo}
                  onChange={this.handleMemoChange}
                  placeholder="Memo"
                  className="form-control form-control-lg"
                />
              </blockquote>
            </div>
            <div className="form-group">
              <a href={url} className="btn btn-success btn-lg">
                <FormattedMessage id="continue" defaultMessage="Continue" />
              </a>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
