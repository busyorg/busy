import React from 'react';
import { FormattedMessage } from 'react-intl';
import { STEEM, SBD } from '../../../common/constants/cryptos';
import CryptoCharts from './CryptoChart';
import './CryptoTrendingCharts.less';

class SteemTrendingCharts extends React.Component {
  constructor(props) {
    super(props);
    this.handleOnClickRefresh = this.handleOnClickRefresh.bind(this);
  }

  handleOnClickRefresh() {
    this.forceUpdate();
  }

  render() {
    return (
      <div className="CryptoTrendingCharts">
        <h4 className="CryptoTrendingCharts__title">
          <i className="iconfont icon-chart CryptoTrendingCharts__icon" />
          <FormattedMessage id="market" defaultMessage="Market" />
          <i
            role="presentation"
            onClick={this.handleOnClickRefresh}
            className="iconfont icon-refresh CryptoTrendingCharts__icon-refresh"
          />
        </h4>
        <CryptoCharts crypto={STEEM.symbol} />
        <div className="CryptoTrendingCharts__divider" />
        <CryptoCharts crypto={SBD.symbol} />
      </div>
    );
  }
}

export default SteemTrendingCharts;
