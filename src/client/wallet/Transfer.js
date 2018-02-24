import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { Form, Input, Radio, Modal } from 'antd';
import { STEEM, SBD } from '../../common/constants/cryptos';
import steemAPI from '../steemAPI';
import SteemConnect from '../steemConnectAPI';
import { getCryptoPriceHistory } from '../app/appActions';
import { closeTransfer } from './walletActions';
import {
  getIsAuthenticated,
  getAuthenticatedUser,
  getIsTransferVisible,
  getTransferTo,
  getCryptosPriceHistory,
} from '../reducers';
import './Transfer.less';

const InputGroup = Input.Group;

@injectIntl
@connect(
  state => ({
    visible: getIsTransferVisible(state),
    to: getTransferTo(state),
    authenticated: getIsAuthenticated(state),
    user: getAuthenticatedUser(state),
    cryptosPriceHistory: getCryptosPriceHistory(state),
  }),
  {
    closeTransfer,
    getCryptoPriceHistory,
  },
)
@Form.create()
export default class Transfer extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    visible: PropTypes.bool,
    to: PropTypes.string,
    authenticated: PropTypes.bool.isRequired,
    user: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
    cryptosPriceHistory: PropTypes.shape().isRequired,
    getCryptoPriceHistory: PropTypes.func.isRequired,
    closeTransfer: PropTypes.func,
  };

  static defaultProps = {
    to: '',
    visible: false,
    closeTransfer: () => {},
  };

  static amountRegex = /^[0-9]*\.?[0-9]{0,3}$/;

  static minAccountLength = 3;
  static maxAccountLength = 16;
  static exchangeRegex = /^(bittrex|blocktrades|poloniex|changelly|openledge|shapeshiftio)$/;

  state = {
    currency: STEEM.symbol,
    oldAmount: undefined,
  };

  componentDidMount() {
    const { cryptosPriceHistory } = this.props;
    const currentSteemRate = _.get(cryptosPriceHistory, 'STEEM.priceDetails.currentUSDPrice', null);
    const currentSBDRate = _.get(cryptosPriceHistory, 'SBD.priceDetails.currentUSDPrice', null);

    if (_.isNull(currentSteemRate)) {
      this.props.getCryptoPriceHistory(STEEM.symbol);
    }

    if (_.isNull(currentSBDRate)) {
      this.props.getCryptoPriceHistory(SBD.symbol);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { form, to } = nextProps;
    if (this.props.to !== to) {
      form.setFieldsValue({
        to,
        amount: undefined,
        currency: STEEM.symbol,
        memo: undefined,
      });
      this.setState({
        currency: STEEM.symbol,
      });
    }
  }

  getUSDValue() {
    const { cryptosPriceHistory, intl } = this.props;
    const { currency, oldAmount } = this.state;
    const currentSteemRate = _.get(cryptosPriceHistory, 'STEEM.priceDetails.currentUSDPrice', null);
    const currentSBDRate = _.get(cryptosPriceHistory, 'SBD.priceDetails.currentUSDPrice', null);
    const steemRateLoading = _.isNull(currentSteemRate) || _.isNull(currentSBDRate);
    const parsedAmount = parseFloat(oldAmount);
    const invalidAmount = parsedAmount <= 0 || _.isNaN(parsedAmount);
    let amount = 0;

    if (steemRateLoading || invalidAmount) return '';

    if (currency === STEEM.symbol) {
      amount = parsedAmount * parseFloat(currentSteemRate);
    } else {
      amount = parsedAmount * parseFloat(currentSBDRate);
    }

    return `~ $${intl.formatNumber(amount, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  handleBalanceClick = event => {
    const { oldAmount } = this.state;
    const value = parseFloat(event.currentTarget.innerText);
    this.setState({
      oldAmount: Transfer.amountRegex.test(value) ? value : oldAmount,
    });
    this.props.form.setFieldsValue({
      amount: value,
    });
  };

  handleCurrencyChange = event => {
    const { form } = this.props;
    this.setState({ currency: event.target.value }, () =>
      form.validateFields(['amount'], { force: true }),
    );
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

        const win = window.open(SteemConnect.sign('transfer', transferQuery), '_blank');
        win.focus();
        this.props.closeTransfer();
      }
    });
  };

  handleCancelClick = () => this.props.closeTransfer();

  handleAmountChange = event => {
    const { value } = event.target;
    const { oldAmount } = this.state;

    this.setState({
      oldAmount: Transfer.amountRegex.test(value) ? value : oldAmount,
    });
    this.props.form.setFieldsValue({
      amount: Transfer.amountRegex.test(value) ? value : oldAmount,
    });
    this.props.form.validateFields(['amount']);
  };

  validateMemo = (rule, value, callback) => {
    const { intl } = this.props;
    const recipientIsExchange = Transfer.exchangeRegex.test(this.props.form.getFieldValue('to'));
    if (recipientIsExchange && (!value || value === '')) {
      callback([
        new Error(
          intl.formatMessage({
            id: 'memo_error_exchange',
            defaultMessage: 'Memo is required when sending to an exchange.',
          }),
        ),
      ]);
    } else {
      callback();
    }
  };

  validateUsername = (rule, value, callback) => {
    const { intl } = this.props;
    this.props.form.validateFields(['memo'], { force: true });

    if (!value) {
      callback();
      return;
    }

    if (value.length < Transfer.minAccountLength) {
      callback([
        new Error(
          intl.formatMessage(
            {
              id: 'username_too_short',
              defaultMessage: 'Username {username} is too short.',
            },
            {
              username: value,
            },
          ),
        ),
      ]);
      return;
    }
    if (value.length > Transfer.maxAccountLength) {
      callback([
        new Error(
          intl.formatMessage(
            {
              id: 'username_too_long',
              defaultMessage: 'Username {username} is too long.',
            },
            {
              username: value,
            },
          ),
        ),
      ]);
      return;
    }
    steemAPI.sendAsync('get_accounts', [[value]]).then(result => {
      if (result[0]) {
        callback();
      } else {
        callback([
          new Error(
            intl.formatMessage(
              {
                id: 'to_error_not_found_username',
                defaultMessage: "Couldn't find user with name {username}.",
              },
              {
                username: value,
              },
            ),
          ),
        ]);
      }
    });
  };

  validateBalance = (rule, value, callback) => {
    const { intl, authenticated, user } = this.props;

    const currentValue = parseFloat(value);

    if (value && currentValue <= 0) {
      callback([
        new Error(
          intl.formatMessage({
            id: 'amount_error_zero',
            defaultMessage: 'Amount has to be higher than 0.',
          }),
        ),
      ]);
      return;
    }

    const selectedBalance = this.state.currency === 'STEEM' ? user.balance : user.sbd_balance;

    if (authenticated && currentValue !== 0 && currentValue > parseFloat(selectedBalance)) {
      callback([
        new Error(
          intl.formatMessage({ id: 'amount_error_funds', defaultMessage: 'Insufficient funds.' }),
        ),
      ]);
    } else {
      callback();
    }
  };

  render() {
    const { intl, visible, authenticated, user } = this.props;
    const { getFieldDecorator } = this.props.form;

    const balance = this.state.currency === STEEM.symbol ? user.balance : user.sbd_balance;

    const currencyPrefix = getFieldDecorator('currency', {
      initialValue: this.state.currency,
    })(
      <Radio.Group onChange={this.handleCurrencyChange} className="Transfer__amount__type">
        <Radio.Button value={STEEM.symbol}>{STEEM.symbol}</Radio.Button>
        <Radio.Button value={SBD.symbol}>{SBD.symbol}</Radio.Button>
      </Radio.Group>,
    );

    const usdValue = this.getUSDValue();

    return (
      <Modal
        visible={visible}
        title={intl.formatMessage({ id: 'transfer_modal_title', defaultMessage: 'Transfer funds' })}
        okText={intl.formatMessage({ id: 'continue', defaultMessage: 'Continue' })}
        cancelText={intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
        onOk={this.handleContinueClick}
        onCancel={this.handleCancelClick}
      >
        <Form className="Transfer" hideRequiredMark>
          <Form.Item label={<FormattedMessage id="to" defaultMessage="To" />}>
            {getFieldDecorator('to', {
              rules: [
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'to_error_empty',
                    defaultMessage: 'Recipient is required.',
                  }),
                },
                { validator: this.validateUsername },
              ],
            })(
              <Input
                type="text"
                placeholder={intl.formatMessage({
                  id: 'to_placeholder',
                  defaultMessage: 'Payment recipient',
                })}
              />,
            )}
          </Form.Item>
          <Form.Item label={<FormattedMessage id="amount" defaultMessage="Amount" />}>
            <InputGroup className="Transfer__amount">
              {getFieldDecorator('amount', {
                trigger: '',
                rules: [
                  {
                    required: true,
                    message: intl.formatMessage({
                      id: 'amount_error_empty',
                      defaultMessage: 'Amount is required.',
                    }),
                  },
                  {
                    pattern: Transfer.amountRegex,
                    message: intl.formatMessage({
                      id: 'amount_error_format',
                      defaultMessage:
                        'Incorrect format. Use comma or dot as decimal separator. Use at most 3 decimal places.',
                    }),
                  },
                  { validator: this.validateBalance },
                ],
              })(
                <Input
                  className="Transfer__amount__input"
                  onChange={this.handleAmountChange}
                  placeholder={intl.formatMessage({
                    id: 'amount_placeholder',
                    defaultMessage: 'How much do you want to send',
                  })}
                />,
              )}
              <Input
                className="Transfer__usd-value"
                addonAfter={currencyPrefix}
                placeholder={usdValue}
              />
            </InputGroup>
            {authenticated && (
              <FormattedMessage
                id="balance_amount"
                defaultMessage="Your balance: {amount}"
                values={{
                  amount: (
                    <span role="presentation" onClick={this.handleBalanceClick} className="balance">
                      {balance}
                    </span>
                  ),
                }}
              />
            )}
          </Form.Item>
          <Form.Item label={<FormattedMessage id="memo" defaultMessage="Memo" />}>
            {getFieldDecorator('memo', {
              rules: [{ validator: this.validateMemo }],
            })(
              <Input.TextArea
                autosize={{ minRows: 2, maxRows: 6 }}
                placeholder={intl.formatMessage({
                  id: 'memo_placeholder',
                  defaultMessage: 'Additional message to include in this payment (optional)',
                })}
              />,
            )}
          </Form.Item>
        </Form>
        <FormattedMessage
          id="transfer_modal_info"
          defaultMessage="Click the button below to be redirected to SteemConnect to complete your transaction."
        />
      </Modal>
    );
  }
}
