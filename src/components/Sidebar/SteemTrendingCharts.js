import React, { Component } from 'react';
import Trend from 'react-trend';
import fetch from 'isomorphic-fetch';
import _ from 'lodash';
import Promise from 'bluebird';
import { FormattedMessage } from 'react-intl';
import Loading from '../Icon/Loading';
import './SteemTrendingCharts.less';
import USDDisplay from '../../components/Utils/USDDisplay';

const getSteemPriceHistory = () =>
  fetch('https://min-api.cryptocompare.com/data/histoday?fsym=STEEM&tsym=USD&limit=7').then(res =>
    res.json(),
  );

const getSteemDollarPriceHistory = () =>
  fetch('https://min-api.cryptocompare.com/data/histoday?fsym=SBD&tsym=USD&limit=7').then(res =>
    res.json(),
  );

class SteemTrendingCharts extends Component {
  state = {
    steemPriceHistory: [],
    steemDollarPriceHistory: [],
    loading: false,
  };

  componentDidMount() {
    this.getSteemPriceHistories();
  }

  getSteemPriceHistories = () => {
    this.setState({
      loading: true,
    });
    Promise.all([getSteemPriceHistory(), getSteemDollarPriceHistory()]).then((response) => {
      const steemPriceHistory = _.map(response[0].Data, data => data.close);
      const steemDollarPriceHistory = _.map(response[1].Data, data => data.close);
      this.setState({
        steemPriceHistory,
        steemDollarPriceHistory,
        loading: false,
      });
    });
  };

  render() {
    const { steemPriceHistory, steemDollarPriceHistory, loading } = this.state;
    const currentSteemPrice = _.last(steemPriceHistory);
    const currentSteemDollarPrice = _.last(steemDollarPriceHistory);
    const previousSteemPrice = _.nth(steemPriceHistory, -2);
    const previousSteemDollarPrice = _.nth(steemDollarPriceHistory, -2);
    const steemPriceIncrease = currentSteemPrice > previousSteemPrice;
    const steemDollarPriceIncrease = currentSteemDollarPrice > previousSteemDollarPrice;

    return (
      <div className="SteemTrendingCharts">
        <h4 className="SteemTrendingCharts__title">
          <i className="iconfont icon-chart SteemTrendingCharts__icon" />
          <FormattedMessage id="market" defaultMessage="Market" />
          <i
            role="presentation"
            onClick={this.getSteemPriceHistories}
            className="iconfont icon-refresh SteemTrendingCharts__icon-refresh"
          />
        </h4>
        <div className="SteemTrendingCharts__divider" />
        <div className="SteemTrendingCharts__chart-header">
          <FormattedMessage id="steem" defaultMessage="Steem" />
          {!loading &&
            <span className="SteemTrendingCharts__chart-value">
              <USDDisplay value={currentSteemPrice} />
              {steemPriceIncrease
                ? <i className="iconfont icon-caret-up SteemTrendingCharts__chart-caret-up" />
                : <i className="iconfont icon-caretbottom SteemTrendingCharts__chart-caret-down" />}
            </span>}
        </div>
        {loading
          ? <Loading />
          : <Trend data={steemPriceHistory} stroke={'#4757b2'} strokeWidth={5} />}
        <div className="SteemTrendingCharts__divider" />
        <div className="SteemTrendingCharts__chart-header">
          <FormattedMessage id="steem_dollar" defaultMessage="Steem Dollar" />
          {!loading &&
            <span className="SteemTrendingCharts__chart-value">
              <USDDisplay value={currentSteemDollarPrice} />
              {steemDollarPriceIncrease
                ? <i className="iconfont icon-caret-up SteemTrendingCharts__chart-caret-up" />
                : <i className="iconfont icon-caretbottom SteemTrendingCharts__chart-caret-down" />}
            </span>}
        </div>
        {loading
          ? <Loading />
          : <Trend data={steemDollarPriceHistory} stroke={'#4757b2'} strokeWidth={5} />}
      </div>
    );
  }
}

export default SteemTrendingCharts;
