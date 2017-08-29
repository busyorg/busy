import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Input, Radio } from 'antd';
import './Transfer.less';

import { getAuthenticatedUser } from '../reducers';

@connect(state => ({
  user: getAuthenticatedUser(state),
}))
@Form.create()
export default class Transfer extends React.Component {
  static propTypes = {
    user: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
  };

  state = {
    from: this.props.user.name,
    to: '',
    memo: '',
    amount: '',
    currency: 'STEEM',
  };

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
    // TODO: Show balance of selected currency
    const { getFieldDecorator } = this.props.form;
    // const { from, to, amount, currency, memo } = this.state;
    // const url = `https://v2.steemconnect.com/sign/transfer?from=${from}&to=${to}&memo=${memo}&amount=${amount}%20${currency}`;

    const currencyPrefix = getFieldDecorator('currency', {
      initialValue: 'SBD',
    })(
      <Radio.Group>
        <Radio.Button value="STEEM">STEEM</Radio.Button>
        <Radio.Button value="SBD">SBD</Radio.Button>
      </Radio.Group>,
    );

    return (
      <Form className="Transfer container">
        <Form.Item>
          {getFieldDecorator('to')(<Input type="text" placeholder="To" />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('amount')(<Input addonAfter={currencyPrefix} placeholder="Amount" style={{ width: '100%' }} />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('memo')(<Input type="text" placeholder="Memo" />)}
        </Form.Item>
      </Form>
    );
  }
}
