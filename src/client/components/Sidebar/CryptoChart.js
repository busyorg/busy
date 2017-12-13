import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import fetch from 'isomorphic-fetch';
import Trend from 'react-trend';
import { getCryptoDetails } from '../../helpers/cryptosHelper';
import USDDisplay from '../../components/Utils/USDDisplay';
import Loading from '../Icon/Loading';

const fetchCryptoPriceHistory = symbol =>
  fetch(
    `https://min-api.cryptocompare.com/data/histoday?fsym=${symbol}&tsym=USD&limit=7`,
  ).then(res => res.json());

class CryptoChart extends React.Component {
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
      <div>
        <div className="CryptoTrendingCharts__chart-header">
          <span>
            {currentCrypto.name}
          </span>
          {!loading &&
            <span className="CryptoTrendingCharts__chart-value">
              <USDDisplay value={currentCryptoPrice} />
              {cryptoPriceIncrease
                ? <i className="iconfont icon-caret-up CryptoTrendingCharts__chart-caret-up" />
                : <i className="iconfont icon-caretbottom CryptoTrendingCharts__chart-caret-down" />}
            </span>}
        </div>
        {loading
          ? <Loading />
          : <Trend data={currentCryptoPriceHistory} stroke={'#4757b2'} strokeWidth={5} />}
      </div>
    );
  }
}

export default CryptoChart;
