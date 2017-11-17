import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { Checkbox } from 'antd';
import { connect } from 'react-redux';
import { updateAccountHistoryFilter } from '../wallet/walletActions';
import './UserActivitySearch.less';

const checkboxValues = {
  upvoted: 'upvoted',
  downvoted: 'downvoted',
  unvoted: 'unvoted',
  followed: ' followed',
  unfollowed: ' unfollowed',
  replied: 'replied',
  reblogged: 'reblogged',
  claimRewards: 'claim_reward_balance',
  poweredUp: 'transfer_to_vesting',
  received: 'received',
  transfer: 'transfer',
  savings: 'savings',
};

const generalFilters = [
  { id: 'upvoted', defaultMessage: 'upvoted', value: checkboxValues.upvoted },
  { id: 'downvoted', defaultMessage: 'downvoted', value: checkboxValues.downvoted },
  { id: 'unvoted', defaultMessage: 'unvoted', value: checkboxValues.unvoted },
  { id: 'followed_filter', defaultMessage: 'followed', value: checkboxValues.followed },
  { id: 'unfollowed_filter', defaultMessage: 'unfollowed', value: checkboxValues.unfollowed },
  { id: 'replied_filter', defaultMessage: 'replied', value: checkboxValues.replied },
  { id: 'reblogged_filter', defaultMessage: 'Reblogged', value: checkboxValues.reblogged },
];

const financeFilters = [
  { id: 'claim_rewards', defaultMessage: 'Claim Rewards', value: checkboxValues.claimRewards },
  { id: 'powered_up', defaultMessage: 'Powered up', value: checkboxValues.poweredUp },
  { id: 'received', defaultMessage: 'Received', value: checkboxValues.received },
  { id: 'transfer', defaultMessage: 'Transfer', value: checkboxValues.transfer },
  { id: 'savings', defaultMessage: 'Savings', value: checkboxValues.savings },
];

@connect(null, {
  updateAccountHistoryFilter,
})
class UserActivitySearch extends React.Component {
  static propTypes = {
    updateAccountHistoryFilter: PropTypes.func.isRequired,
  };

  state = {
    value: '',
    checked: {
      [checkboxValues.upvoted]: false,
      [checkboxValues.downvoted]: false,
      [checkboxValues.unvoted]: false,
      [checkboxValues.followed]: false,
      [checkboxValues.unfollowed]: false,
      [checkboxValues.replied]: false,
      [checkboxValues.reblogged]: false,
      [checkboxValues.claimRewards]: false,
      [checkboxValues.poweredUp]: false,
      [checkboxValues.received]: false,
      [checkboxValues.transfer]: false,
      [checkboxValues.savings]: false,
    },
    showGeneral: true,
    showFinance: true,
  };

  handleOnChangeCheckbox = (e) => {
    const checked = {
      ...this.state.checked,
      [e.target.value]: e.target.checked,
    };
    this.setState({
      checked,
    });
    const formattedCheckedValues = _.reduce(
      checked,
      (filterArray, isChecked, filter) => {
        if (isChecked) {
          filterArray.push(filter);
        }
        return filterArray;
      },
      [],
    );
    this.props.updateAccountHistoryFilter(formattedCheckedValues);
  };

  toggleFilterSection = showFilter =>
    this.setState({
      [showFilter]: !this.state[showFilter],
    });

  renderFilters = filterTypes =>
    _.map(filterTypes, filter => (
      <div key={filter.id} className="UserActivitySearch__filters__item">
        <Checkbox
          value={filter.value}
          onChange={this.handleOnChangeCheckbox}
          checked={this.state.checked[filter.value]}
        />
        <FormattedMessage id={filter.id} defaultMessage={filter.defaultMessage} />
      </div>
    ));

  render() {
    const { showGeneral, showFinance } = this.state;
    return (
      <div className="UserActivitySearch">
        <h4 className="UserActivitySearch__title">
          <i className="iconfont icon-trysearchlist UserActivitySearch__title__icon" />
          <FormattedMessage id="filter_activities" defaultMessage="Filter Activities" />
        </h4>
        <div className="UserActivitySearch__filters__divider" />
        <div className="UserActivitySearch__filters">
          <div className="UserActivitySearch__filters__container">
            <div
              role="presentation"
              className="UserActivitySearch__filters__title"
              onClick={() => this.toggleFilterSection('showGeneral')}
            >
              <FormattedMessage id="general" defaultMessage="general" />
              <span className="UserActivitySearch__filters__title__icon">
                {showGeneral
                  ? <i className="iconfont icon-minus" />
                  : <i className="iconfont icon-add" />}
              </span>
            </div>
            {showGeneral &&
              <div className="UserActivitySearch__filters__content">
                {this.renderFilters(generalFilters)}
              </div>}
          </div>
          <div className="UserActivitySearch__filters__divider" />
          <div className="UserActivitySearch__filters__container">
            <div
              role="presentation"
              className="UserActivitySearch__filters__title"
              onClick={() => this.toggleFilterSection('showFinance')}
            >
              <FormattedMessage id="finance" defaultMessage="finance" />
              <span className="UserActivitySearch__filters__title__icon">
                {showFinance
                  ? <i className="iconfont icon-minus" />
                  : <i className="iconfont icon-add" />}
              </span>
            </div>
            {showFinance &&
              <div className="UserActivitySearch__filters__content">
                {this.renderFilters(financeFilters)}
              </div>}
          </div>
        </div>
      </div>
    );
  }
}

export default UserActivitySearch;
