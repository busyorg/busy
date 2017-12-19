import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import CryptoChart from './CryptoChart';
import './CryptoTrendingCharts.less';
import './SidebarContentBlock.less';

class CryptoTrendingCharts extends React.Component {
  static propTypes = {
    cryptos: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    cryptos: [],
  };

  renderCryptoCharts() {
    const { cryptos } = this.props;

    if (_.isEmpty(cryptos)) {
      return null;
    }

    return _.map(cryptos, (crypto, index) => {
      const isNotLastElement = index < cryptos.length - 1;
      return (
        <CryptoChart
          key={crypto}
          crypto={crypto}
          renderDivider={isNotLastElement}
        />
      );
    });
  }

  render() {
    return (
      <div className="SidebarContentBlock">
        <h4 className="SidebarContentBlock__title">
          <i className="iconfont icon-chart SidebarContentBlock__icon" />
          <FormattedMessage id="market" defaultMessage="Market" />
        </h4>
        {this.renderCryptoCharts()}
      </div>
    );
  }
}

export default CryptoTrendingCharts;
