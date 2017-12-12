import React from 'react';
import PropTypes from 'prop-types';
import Trend from 'react-trend';
import fetch from 'isomorphic-fetch';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import Loading from '../Icon/Loading';
import { getCryptoDetails } from '../../helpers/cryptosHelper';
import USDDisplay from '../../components/Utils/USDDisplay';
import './SteemTrendingCharts.less';

const fetchCryptoPriceHistory = symbol =>
  fetch(
    `https://min-api.cryptocompare.com/data/histoday?fsym=${symbol}&tsym=USD&limit=7`,
  ).then(res => res.json());

class CryptoTrendingCharts extends React.Component {
  static propTypes = {
    crypto: PropTypes.string,
  };

  static defaultProps = {
    crypto: '',
  };

  constructor(props) {
    super(props);
    const currentCrypto = getCryptoDetails(props.crypto);

    this.state = {
      currentCrypto,
      currentCryptoPriceHistory: [],
      loading: false,
    };

    this.getCryptoPriceHistory = this.getCryptoPriceHistory.bind(this);
  }

  componentDidMount() {
    const { currentCrypto } = this.state;
    if (!_.isEmpty(currentCrypto)) {
      this.getCryptoPriceHistory(currentCrypto.symbol);
    }
  }

  componentWillReceiveProps(nextProps) {
    const currentCrypto = getCryptoDetails(nextProps.crypto);
    if (!_.isEmpty(currentCrypto)) {
      this.setState(
        {
          currentCrypto,
        },
        () => this.getCryptoPriceHistory(currentCrypto.symbol),
      );
    } else {
      this.setState({
        currentCrypto,
      });
    }
  }

  getCryptoPriceHistory(symbol) {
    this.setState({
      loading: true,
    });
    fetchCryptoPriceHistory(symbol).then((response) => {
      const currentCryptoPriceHistory = _.map(response.Data, data => data.close);
      this.setState({
        currentCryptoPriceHistory,
        loading: false,
      });
    });
  }

  render() {
    const { currentCryptoPriceHistory, loading, currentCrypto } = this.state;

    if (_.isEmpty(currentCrypto)) return null;

    const currentCryptoPrice = _.last(currentCryptoPriceHistory);
    const previousCryptoPrice = _.nth(currentCryptoPriceHistory, -2);
    const cryptoPriceIncrease = currentCryptoPrice > previousCryptoPrice;

    return (
      <div className="SteemTrendingCharts">
        <h4 className="SteemTrendingCharts__title">
          <i className="iconfont icon-chart SteemTrendingCharts__icon" />
          <FormattedMessage id="market" defaultMessage="Market" />
          <i
            role="presentation"
            onClick={() => this.getCryptoPriceHistory(currentCrypto.symbol)}
            className="iconfont icon-refresh SteemTrendingCharts__icon-refresh"
          />
        </h4>
        <div className="SteemTrendingCharts__divider" />
        <div className="SteemTrendingCharts__chart-header">
          <span>
            {currentCrypto.name}
          </span>
          {!loading &&
            <span className="SteemTrendingCharts__chart-value">
              <USDDisplay value={currentCryptoPrice} />
              {cryptoPriceIncrease
                ? <i className="iconfont icon-caret-up SteemTrendingCharts__chart-caret-up" />
                : <i className="iconfont icon-caretbottom SteemTrendingCharts__chart-caret-down" />}
            </span>}
        </div>
        {loading
          ? <Loading />
          : <Trend data={currentCryptoPriceHistory} stroke={'#4757b2'} strokeWidth={5} />}
      </div>
    );
  }
}

export default CryptoTrendingCharts;
