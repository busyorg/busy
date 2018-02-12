import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getCryptosPriceHistory } from '../../reducers';
import CryptoChart from './CryptoChart';
import './CryptoTrendingCharts.less';
import './SidebarContentBlock.less';
import { getCryptoDetails } from '../../helpers/cryptosHelper';

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
    const { cryptosPriceHistory, cryptos } = this.props;
    const apiErrors = [];

    if (_.isEmpty(cryptosPriceHistory)) {
      return false;
    }

    _.each(cryptos, crypto => {
      const cryptoDetails = getCryptoDetails(crypto);
      const cryptoSymbol = _.get(cryptoDetails, 'symbol', null);
      const cryptoAPIDetails = _.get(cryptosPriceHistory, _.upperCase(cryptoSymbol), null);
      const hasAPIError =
        !(_.isUndefined(cryptoAPIDetails) || _.isNull(cryptoAPIDetails)) &&
        (cryptoAPIDetails.usdAPIError || _.isEmpty(cryptoAPIDetails.usdPriceHistory));
      if (hasAPIError) {
        apiErrors.push(cryptoDetails);
      }
    });

    return cryptos.length === apiErrors.length;
  }

  renderCryptoCharts() {
    const { cryptos, cryptosPriceHistory } = this.props;
    const { refreshCharts } = this.state;

    if (_.isEmpty(cryptos)) {
      return null;
    }

    return _.map(cryptos, crypto => [
      <CryptoChart key={crypto} crypto={crypto} refreshCharts={refreshCharts} />,
      !_.isEmpty(_.get(cryptosPriceHistory, `${crypto}.usdPriceHistory`, [])) && (
        <div key={`${crypto}-divider`} className="SidebarContentBlock__divider" />
      ),
    ]);
  }

  render() {
    if (this.hasAPIError()) return <div />;

    return (
      <div className="SidebarContentBlock CryptoTrendingCharts">
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
