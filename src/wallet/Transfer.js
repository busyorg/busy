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
    currency: 'STEEM',
  };

  handleBalanceClick = (event) => {
    this.props.form.setFieldsValue({
      amount: parseFloat(event.currentTarget.innerText),
    });
  }

  handleCurrencyChange = (event) => {
    this.setState({ currency: event.target.value });
  };

  render() {
    const { user } = this.props;
    const { getFieldDecorator } = this.props.form;

    const balance = this.state.currency === 'STEEM' ? user.balance : user.sbd_balance;

    const currencyPrefix = getFieldDecorator('currency', {
      initialValue: this.state.currency,
    })(
      <Radio.Group onChange={this.handleCurrencyChange}>
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
            Your balance: <span role="presentation" onClick={this.handleBalanceClick} className="balance">{balance}</span>
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
