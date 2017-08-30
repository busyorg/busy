import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import steemConnect from 'sc2-sdk';
import { Form, Input, Radio, Modal } from 'antd';
import './Transfer.less';

import { closeTransfer } from './walletActions';
import { getAuthenticatedUser } from '../reducers';

@connect(state => ({
  visible: state.wallet.transferVisible,
  to: state.wallet.transferTo,
  user: getAuthenticatedUser(state),
}), {
  closeTransfer,
})
@Form.create()
export default class Transfer extends React.Component {
  static propTypes = {
    visible: PropTypes.bool,
    to: PropTypes.string,
    user: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
    closeTransfer: PropTypes.func,
  };

  static defaultProps = {
    to: '',
    visible: false,
    closeTransfer: () => {},
  };

  state = {
    currency: 'STEEM',
  };

  componentWillReceiveProps(nextProps) {
    const { form, to } = nextProps;
    if (this.props.to !== to) {
      form.setFieldsValue({
        to,
        amount: undefined,
        currency: 'STEEM',
        memo: undefined,
      });
      this.setState({
        currency: 'STEEM',
      });
    }
  }

  handleBalanceClick = (event) => {
    this.props.form.setFieldsValue({
      amount: parseFloat(event.currentTarget.innerText),
    });
  }

  handleCurrencyChange = (event) => {
    const { form } = this.props;
    this.setState({ currency: event.target.value }, () => form.validateFields(['amount'], { force: true }));
  };

  handleContinueClick = () => {
    const { form } = this.props;
    form.validateFields({ force: true }, (errors, values) => {
      if (!errors) {
        const transferQuery = {
          to: values.to,
          amount: `${values.amount} ${values.currency}`,
        };
        if (values.memo) transferQuery.memo = values.memo;

        const win = window.open(steemConnect.sign('transfer', transferQuery), '_blank');
        win.focus();
        this.props.closeTransfer();
      }
    });
  }

  handleCancelClick = () => this.props.closeTransfer();

  validateBalance = (rule, value, callback) => {
    const { user } = this.props;

    const currentValue = parseFloat(value);
    const selectedBalance = this.state.currency === 'STEEM' ? user.balance : user.sbd_balance;

    if (currentValue !== 0 && currentValue > parseFloat(selectedBalance)) {
      callback([
        new Error('Insufficient funds'),
      ]);
    } else {
      callback();
    }
  }

  render() {
    const { visible, user } = this.props;
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
      <Modal visible={visible} title="Send STEEM or SBD" okText="Continue" onOk={this.handleContinueClick} onCancel={this.handleCancelClick}>
        <Form className="Transfer container">
          <Form.Item label={<b>To</b>}>
            {getFieldDecorator('to', {
              rules: [{ required: true, message: 'Recipient is required' }],
            })(<Input type="text" placeholder="Payment recipient" />)}
          </Form.Item>
          <Form.Item label={<b>Amount</b>}>
            {getFieldDecorator('amount', {
              rules: [
                { required: true, message: 'Amount is required' },
                { pattern: /^[0-9]*[.,]{0,1}[0-9]{0,3}$/, message: 'Incorrect format. Use comma or dot as decimal separator. Use at most 3 decimal places.' },
                { validator: this.validateBalance },
              ],
            })(<Input addonAfter={currencyPrefix} placeholder="How much do you want to send" style={{ width: '100%' }} />)}
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
