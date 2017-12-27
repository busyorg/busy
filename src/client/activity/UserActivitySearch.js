import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Checkbox } from 'antd';
import { getUser, getAuthenticatedUser } from '../reducers';
import * as accountHistoryConstants from '../../common/constants/accountHistory';
import { updateAccountHistoryFilter } from '../wallet/walletActions';
import './UserActivitySearch.less';
import '../components/Sidebar/SidebarContentBlock.less';

const filterValues = {
  [accountHistoryConstants.UPVOTED]: {
    id: accountHistoryConstants.UPVOTED,
    messageId: accountHistoryConstants.UPVOTED,
    defaultMessage: accountHistoryConstants.UPVOTED,
    value: [accountHistoryConstants.UPVOTED],
  },
  [accountHistoryConstants.DOWNVOTED]: {
    id: accountHistoryConstants.DOWNVOTED,
    messageId: accountHistoryConstants.DOWNVOTED,
    defaultMessage: accountHistoryConstants.DOWNVOTED,
    value: [accountHistoryConstants.DOWNVOTED],
  },
  [accountHistoryConstants.UNVOTED]: {
    id: accountHistoryConstants.UNVOTED,
    messageId: accountHistoryConstants.UNVOTED,
    defaultMessage: accountHistoryConstants.UNVOTED,
    value: [accountHistoryConstants.UNVOTED],
  },
  [accountHistoryConstants.FOLLOWED]: {
    id: accountHistoryConstants.FOLLOWED,
    messageId: 'followed_filter',
    defaultMessage: accountHistoryConstants.FOLLOWED,
    value: [`+${accountHistoryConstants.FOLLOWED}`],
  },
  [accountHistoryConstants.UNFOLLOWED]: {
    id: accountHistoryConstants.UNFOLLOWED,
    messageId: 'unfollowed_filter',
    defaultMessage: accountHistoryConstants.UNFOLLOWED,
    value: [`-${accountHistoryConstants.UNFOLLOWED}`],
  },
  [accountHistoryConstants.REPLIED]: {
    id: accountHistoryConstants.REPLIED,
    messageId: 'replied_filter',
    defaultMessage: accountHistoryConstants.REPLIED,
    value: [accountHistoryConstants.REPLIED],
  },
  [accountHistoryConstants.REBLOGGED]: {
    id: accountHistoryConstants.REBLOGGED,
    messageId: 'reblogged_filter',
    defaultMessage: accountHistoryConstants.REBLOGGED,
    value: [accountHistoryConstants.REBLOGGED],
  },
  [accountHistoryConstants.AUTHOR_REWARD]: {
    id: accountHistoryConstants.AUTHOR_REWARD,
    messageId: accountHistoryConstants.AUTHOR_REWARD,
    defaultMessage: 'Author reward',
    value: [accountHistoryConstants.AUTHOR_REWARD],
  },
  [accountHistoryConstants.CURATION_REWARD]: {
    id: accountHistoryConstants.CURATION_REWARD,
    messageId: accountHistoryConstants.CURATION_REWARD,
    defaultMessage: 'Curation reward',
    value: [accountHistoryConstants.CURATION_REWARD],
  },
  [accountHistoryConstants.CLAIM_REWARDS]: {
    id: accountHistoryConstants.CLAIM_REWARDS,
    messageId: accountHistoryConstants.CLAIM_REWARDS,
    defaultMessage: 'Claim rewards',
    value: [accountHistoryConstants.CLAIM_REWARDS, accountHistoryConstants.CLAIM_REWARD_BALANCE],
  },
  [accountHistoryConstants.POWERED_UP]: {
    id: accountHistoryConstants.POWERED_UP,
    messageId: accountHistoryConstants.POWERED_UP,
    defaultMessage: 'Powered up',
    value: [accountHistoryConstants.POWERED_UP, accountHistoryConstants.TRANSFER_TO_VESTING],
  },
  [accountHistoryConstants.RECEIVED]: {
    id: accountHistoryConstants.RECEIVED,
    messageId: accountHistoryConstants.RECEIVED,
    defaultMessage: 'Received',
    value: [accountHistoryConstants.RECEIVED],
  },
  [accountHistoryConstants.TRANSFER]: {
    id: accountHistoryConstants.TRANSFER,
    messageId: accountHistoryConstants.TRANSFER,
    defaultMessage: 'Transfer',
    value: [accountHistoryConstants.TRANSFERRED],
  },
  [accountHistoryConstants.SAVINGS]: {
    id: accountHistoryConstants.SAVINGS,
    messageId: accountHistoryConstants.SAVINGS,
    defaultMessage: 'Savings',
    value: [
      accountHistoryConstants.CANCEL_TRANSFER_FROM_SAVINGS,
      accountHistoryConstants.TRANSFER_FROM_SAVINGS,
      accountHistoryConstants.TRANSFER_TO_SAVINGS,
    ],
  },
};

const generalFilters = [
  filterValues[accountHistoryConstants.UPVOTED],
  filterValues[accountHistoryConstants.DOWNVOTED],
  filterValues[accountHistoryConstants.UNVOTED],
  filterValues[accountHistoryConstants.FOLLOWED],
  filterValues[accountHistoryConstants.UNFOLLOWED],
  filterValues[accountHistoryConstants.REPLIED],
  filterValues[accountHistoryConstants.REBLOGGED],
];

const financeFilters = [
  filterValues[accountHistoryConstants.POWERED_UP],
  filterValues[accountHistoryConstants.RECEIVED],
  filterValues[accountHistoryConstants.TRANSFER],
  filterValues[accountHistoryConstants.SAVINGS],
];

const rewardsFilters = [
  filterValues[accountHistoryConstants.AUTHOR_REWARD],
  filterValues[accountHistoryConstants.CURATION_REWARD],
  filterValues[accountHistoryConstants.CLAIM_REWARDS],
];

@connect(
  (state, ownProps) => ({
    user:
      ownProps.location.pathname === '/activity'
        ? getAuthenticatedUser(state)
        : getUser(state, ownProps.match.params.name),
  }),
  {
    updateAccountHistoryFilter,
  },
)
class UserActivitySearch extends React.Component {
  static propTypes = {
    updateAccountHistoryFilter: PropTypes.func.isRequired,
    user: PropTypes.shape().isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      value: '',
      checked: {
        [filterValues[accountHistoryConstants.UPVOTED].id]: false,
        [filterValues[accountHistoryConstants.DOWNVOTED].id]: false,
        [filterValues[accountHistoryConstants.UNVOTED].id]: false,
        [filterValues[accountHistoryConstants.FOLLOWED].id]: false,
        [filterValues[accountHistoryConstants.UNFOLLOWED].id]: false,
        [filterValues[accountHistoryConstants.REPLIED].id]: false,
        [filterValues[accountHistoryConstants.REBLOGGED].id]: false,
        [filterValues[accountHistoryConstants.AUTHOR_REWARD].id]: false,
        [filterValues[accountHistoryConstants.CURATION_REWARD].id]: false,
        [filterValues[accountHistoryConstants.CLAIM_REWARDS].id]: false,
        [filterValues[accountHistoryConstants.POWERED_UP].id]: false,
        [filterValues[accountHistoryConstants.RECEIVED].id]: false,
        [filterValues[accountHistoryConstants.TRANSFER].id]: false,
        [filterValues[accountHistoryConstants.SAVINGS].id]: false,
      },
      showGeneral: true,
      showFinance: true,
      showRewards: true,
    };

    this.handleOnChangeCheckbox = this.handleOnChangeCheckbox.bind(this);
    this.handleGeneralFiltersDisplay = this.handleGeneralFiltersDisplay.bind(this);
    this.handleFinanceFiltersDisplay = this.handleFinanceFiltersDisplay.bind(this);
    this.handleRewardsFilterDisplay = this.handleRewardsFilterDisplay.bind(this);
  }

  handleOnChangeCheckbox(e) {
    const checked = {
      ...this.state.checked,
      [e.target.name]: e.target.checked,
    };
    const accountHistoryFilter = _.reduce(
      checked,
      (filterArray, isChecked, filter) => {
        if (isChecked) {
          return filterArray.concat(filterValues[filter].value);
        }
        return filterArray;
      },
      [],
    );

    this.setState(
      {
        checked,
      },
      () =>
        this.props.updateAccountHistoryFilter({
          username: this.props.user.name,
          accountHistoryFilter,
        }),
    );
  }

  toggleFilterSection(showFilter) {
    this.setState({
      [showFilter]: !this.state[showFilter],
    });
  }

  handleGeneralFiltersDisplay() {
    this.toggleFilterSection('showGeneral');
  }

  handleFinanceFiltersDisplay() {
    this.toggleFilterSection('showFinance');
  }

  handleRewardsFilterDisplay() {
    this.toggleFilterSection('showRewards');
  }

  renderFilters(filterTypes) {
    return _.map(filterTypes, filter => (
      <div key={filter.id} className="UserActivitySearch__filters__item">
        <Checkbox
          name={filter.id}
          value={filter.value}
          onChange={this.handleOnChangeCheckbox}
          checked={this.state.checked[filter.id]}
        >
          <span className="UserActivitySearch__filters__item__label">
            <FormattedMessage id={filter.messageId} defaultMessage={filter.defaultMessage} />
          </span>
        </Checkbox>
      </div>
    ));
  }

  render() {
    const { showGeneral, showFinance, showRewards } = this.state;

    return (
      <div className="UserActivitySearch SidebarContentBlock">
        <h4 className="SidebarContentBlock__title">
          <i className="iconfont icon-trysearchlist SidebarContentBlock__icon" />
          <FormattedMessage id="filter_activities" defaultMessage="Filter Activities" />
        </h4>
        <div className="SidebarContentBlock__content">
          <div className="UserActivitySearch__filters">
            <div className="UserActivitySearch__filters__container">
              <div
                role="presentation"
                className="UserActivitySearch__filters__title"
                onClick={this.handleGeneralFiltersDisplay}
              >
                <FormattedMessage id="general" defaultMessage="general" />
                <span className="UserActivitySearch__filters__title__icon">
                  {showGeneral ? (
                    <i className="iconfont icon-offline" />
                  ) : (
                    <i className="iconfont icon-addition" />
                  )}
                </span>
              </div>
              {showGeneral && (
                <div className="UserActivitySearch__filters__content">
                  {this.renderFilters(generalFilters)}
                </div>
              )}
            </div>
            <div className="UserActivitySearch__filters__container">
              <div
                role="presentation"
                className="UserActivitySearch__filters__title"
                onClick={this.handleFinanceFiltersDisplay}
              >
                <FormattedMessage id="finance" defaultMessage="finance" />
                <span className="UserActivitySearch__filters__title__icon">
                  {showFinance ? (
                    <i className="iconfont icon-offline" />
                  ) : (
                    <i className="iconfont icon-addition" />
                  )}
                </span>
              </div>
              {showFinance && (
                <div className="UserActivitySearch__filters__content">
                  {this.renderFilters(financeFilters)}
                </div>
              )}
            </div>
            <div className="UserActivitySearch__filters__container">
              <div
                role="presentation"
                className="UserActivitySearch__filters__title"
                onClick={this.handleRewardsFilterDisplay}
              >
                <FormattedMessage id="rewards" defaultMessage="Rewards" />
                <span className="UserActivitySearch__filters__title__icon">
                  {showRewards ? (
                    <i className="iconfont icon-offline" />
                  ) : (
                    <i className="iconfont icon-addition" />
                  )}
                </span>
              </div>
              {showRewards && (
                <div className="UserActivitySearch__filters__content">
                  {this.renderFilters(rewardsFilters)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserActivitySearch;
