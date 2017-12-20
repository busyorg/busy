import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getCryptosPriceHistory } from '../../reducers';
import CryptoChart from './CryptoChart';
import './CryptoTrendingCharts.less';
import './SidebarContentBlock.less';

@connect(state => ({
  cryptosPriceHistory: getCryptosPriceHistory(state),
}))
class CryptoTrendingCharts extends React.Component {
  static propTypes = {
    cryptos: PropTypes.arrayOf(PropTypes.string),
    cryptosPriceHistory: PropTypes.shape().isRequired,
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

  hasAPIError() {
    const { cryptosPriceHistory } = this.props;
    const apiErrors = [];

    if (_.isEmpty(cryptosPriceHistory)) {
      return false;
    }

    _.each(cryptosPriceHistory, (cryptoDetails) => {
      if (!_.isNull(cryptoDetails) && cryptoDetails.usdAPIError) {
        apiErrors.push(cryptoDetails);
      }
    });

    return _.keys(cryptosPriceHistory).length === apiErrors.length;
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
    if (this.hasAPIError()) return <div />;

    return (
      <div className="SidebarContentBlock">
        <h4 className="SidebarContentBlock__title">
          <i className="iconfont icon-chart SidebarContentBlock__icon" />
          <FormattedMessage id="market" defaultMessage="Market" />
          <i
            role="presentation"
            onClick={this.handleOnClickRefresh}
            className="iconfont icon-refresh CryptoTrendingCharts__icon-refresh"
          />
        </h4>
        {this.renderCryptoCharts()}
      </div>
    );
  }
}

export default CryptoTrendingCharts;
