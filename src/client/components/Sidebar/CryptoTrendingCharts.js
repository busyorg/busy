import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import CryptoChart from './CryptoChart';
import './CryptoTrendingCharts.less';

class CryptoTrendingCharts extends React.Component {
  static propTypes = {
    cryptos: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    cryptos: [],
  };

  constructor(props) {
    super(props);

    this.handleOnClickRefresh = this.handleOnClickRefresh.bind(this);
  }

  handleOnClickRefresh() {
    this.forceUpdate();
  }

  renderCryptoCharts() {
    const { cryptos } = this.props;
    if (_.isEmpty(cryptos)) {
      return null;
    }
    return _.map(cryptos, crypto => <CryptoChart key={crypto} crypto={crypto} />);
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
        <div className="CryptoTrendingCharts__divider" />
        {this.renderCryptoCharts()}
      </div>
    );
  }
}

export default CryptoTrendingCharts;
