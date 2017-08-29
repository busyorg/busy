import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Input, Radio, Modal } from 'antd';
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
      <Modal visible title="Send STEEM or SBD" okText="Continue">
        <Form className="Transfer container">
          <Form.Item label={<b>To</b>}>
            {getFieldDecorator('to')(<Input type="text" placeholder="Payment recipient" />)}
          </Form.Item>
          <Form.Item label={<b>Amount</b>}>
            {getFieldDecorator('amount')(<Input addonAfter={currencyPrefix} placeholder="How much do you want to send" style={{ width: '100%' }} />)}
          </Form.Item>
          <Form.Item label={<b>Memo</b>}>
            {getFieldDecorator('memo')(<Input.TextArea rows={3} placeholder="Additional message to include in this payment (optional)" />)}
          </Form.Item>
        </Form>
        <p>
          Click the button below to be redirected to
          SteemConnect to complete your transaction.
        </p>
      </Modal>
    );
  }
}
