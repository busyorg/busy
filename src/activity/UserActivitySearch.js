import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Input } from 'antd';
import { updateAccountHistoryFilter } from '../wallet/walletActions';
import './UserActivitySearch.less';

const ENTER_KEY = 13;

@injectIntl
@connect(null, {
  updateAccountHistoryFilter,
})
class UserActivitySearch extends Component {
  static propTypes = {
    updateAccountHistoryFilter: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
  };

  state = {
    value: '',
  };

  handleChange = (e) => {
    if (e.target.value === '') {
      this.props.updateAccountHistoryFilter('');
    }
    this.setState({ value: e.target.value });
  };

  handleKeyDown = (e) => {
    if (e.keyCode === ENTER_KEY) {
      this.handleSearch();
    }
  };

  handleSearch = () => {
    this.props.updateAccountHistoryFilter(this.state.value);
  };

  render() {
    return (
      <div className="UserActivitySearch">
        <h4 className="UserActivitySearch__title">
          <i className="iconfont icon-trysearchlist UserActivitySearch__title__icon" />
          <FormattedMessage id="search_users_activity" defaultValue="Search Users Activity" />
        </h4>
        <div className="UserActivitySearch__divider" />
        <div className="UserActivitySearch__input">
          <Input
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            placeholder={`${this.props.intl.formatMessage({
              id: 'search_activity_placeholder',
              defaultMessage: 'Search for activities',
            })}...`}
          />
          <button className="UserActivitySearch__icon" onClick={this.handleSearch}>
            <i className="iconfont icon-search" />
          </button>
        </div>
      </div>
    );
  }
}

export default UserActivitySearch;
