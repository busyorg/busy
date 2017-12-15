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

    this.state = {
      refreshCharts: false,
    };

    this.handleOnClickRefresh = this.handleOnClickRefresh.bind(this);
  }

  handleOnClickRefresh() {
    this.setState(
      {
        refreshCharts: true,
      },
      () => {
        this.setState({
          refreshCharts: false,
        });
      },
    );
  }

  renderCryptoCharts() {
    const { cryptos } = this.props;
    const { refreshCharts } = this.state;

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
          refreshCharts={refreshCharts}
        />
      );
    });
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
