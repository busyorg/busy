import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import classNames from 'classnames';
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
} from 'recharts';
import { FormattedNumber } from 'react-intl';
import { getCryptosPriceHistory } from '../../reducers';
import { getCryptoPriceHistory } from '../../app/appActions';
import { getCryptoDetails } from '../../helpers/cryptosHelper';
import USDDisplay from '../Utils/USDDisplay';
import Loading from '../Icon/Loading';
import CryptoChartTooltip from './CryptoChartTooltip';

@connect(
  state => ({
    cryptosPriceHistory: getCryptosPriceHistory(state),
  }),
  {
    getCryptoPriceHistory,
  },
)
class CryptoChart extends React.Component {
  static propTypes = {
    cryptosPriceHistory: PropTypes.shape().isRequired,
    getCryptoPriceHistory: PropTypes.func.isRequired,
    refreshCharts: PropTypes.bool,
    renderDivider: PropTypes.bool,
    crypto: PropTypes.string,
  };

  static defaultProps = {
    refreshCharts: false,
    renderDivider: true,
    crypto: '',
  };

  constructor(props) {
    super(props);
    const currentCrypto = getCryptoDetails(props.crypto);

    this.state = {
      currentCrypto,
      displayChart: false,
    };

    this.toggleDisplayChart = this.toggleDisplayChart.bind(this);
  }

  componentDidMount() {
    const { currentCrypto } = this.state;
    if (!_.isEmpty(currentCrypto)) {
      this.props.getCryptoPriceHistory(currentCrypto.symbol);
    }
  }

  componentWillReceiveProps(nextProps) {
    const currentCrypto = getCryptoDetails(nextProps.crypto);
    const isDifferentCrypto = this.props.crypto !== nextProps.crypto;
    if (isDifferentCrypto || nextProps.refreshCharts) {
      this.setState(
        {
          currentCrypto,
        },
        () => this.props.getCryptoPriceHistory(currentCrypto.symbol, true),
      );
    } else {
      this.setState({
        currentCrypto,
      });
    }
  }

  toggleDisplayChart(displayChart) {
    this.setState({
      displayChart,
    });
  }

  renderRecharts() {
    const { cryptosPriceHistory } = this.props;
    const { currentCrypto } = this.state;
    const cryptoUSDPriceHistoryKey = `${currentCrypto.symbol}.usdPriceHistory`;
    const formattedData = _.get(cryptosPriceHistory, cryptoUSDPriceHistoryKey, []);
    return (
      <ResponsiveContainer width="100%" height={65}>
        <LineChart data={formattedData}>
          <YAxis dataKey="price" type="number" hide />
          <XAxis
            dataKey="day"
            type="category"
            padding={{ left: 10 }}
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 15,
              fontWeight: 'bold',
              fill: '#99aab5',
            }}
            mirror
          />
          <CartesianGrid horizontal={false} vertical={false} />
          <Tooltip content={<CryptoChartTooltip />} cursor={false} />
          <Line
            dataKey="price"
            stroke="#4757b2"
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  renderUSDPrice() {
    const { cryptosPriceHistory } = this.props;
    const { currentCrypto } = this.state;
    const cryptoPriceDetailsKey = `${currentCrypto.symbol}.priceDetails`;
    const priceDetails = _.get(cryptosPriceHistory, cryptoPriceDetailsKey, {});
    const currentUSDPrice = _.get(priceDetails, 'currentUSDPrice', 0);
    const usdIncrease = _.get(priceDetails, 'cryptoUSDIncrease', false);
    const usdPriceDifferencePercent = _.get(priceDetails, 'usdPriceDifferencePercent', 0);

    return (
      <div className="CryptoTrendingCharts__chart-value">
        <span className="CryptoTrendingCharts__usd-price">
          <USDDisplay value={currentUSDPrice} />
        </span>
        <span
          className={classNames('CryptoTrendingCharts__chart-percent', {
            'CryptoTrendingCharts__chart-price-up': usdIncrease,
            'CryptoTrendingCharts__chart-price-down': !usdIncrease,
          })}
        >
          (<FormattedNumber
            style="percent" // eslint-disable-line react/style-prop-object
            value={usdPriceDifferencePercent}
            minimumFractionDigits={2}
            maximumFractionDigits={2}
          />)
        </span>
        <i
          className={classNames('iconfont CryptoTrendingCharts__chart-caret', {
            'icon-caret-up': usdIncrease,
            'icon-caretbottom': !usdIncrease,
            'CryptoTrendingCharts__chart-price-up': usdIncrease,
            'CryptoTrendingCharts__chart-price-down': !usdIncrease,
          })}
        />
      </div>
    );
  }

  renderBTCPrice() {
    const { cryptosPriceHistory } = this.props;
    const { currentCrypto } = this.state;
    const cryptoPriceDetailsKey = `${currentCrypto.symbol}.priceDetails`;
    const cryptoBTCAPIErrorKey = `${currentCrypto.symbol}.btcAPIError`;
    const priceDetails = _.get(cryptosPriceHistory, cryptoPriceDetailsKey, {});
    const btcAPIError = _.get(cryptosPriceHistory, cryptoBTCAPIErrorKey, true);

    if (btcAPIError) return null;

    const currentBTCPrice = _.get(priceDetails, 'currentBTCPrice', 0);
    const btcIncrease = _.get(priceDetails, 'cryptoBTCIncrease', false);
    const btcPriceDifferencePercent = _.get(priceDetails, 'btcPriceDifferencePercent', 0);
    return (
      <div className="CryptoTrendingCharts__chart-value">
        <span className="CryptoTrendingCharts__btc-price">
          <FormattedNumber value={currentBTCPrice} minimumFractionDigits={7} />
          {' BTC'}
        </span>
        <span
          className={classNames('CryptoTrendingCharts__chart-percent', {
            'CryptoTrendingCharts__chart-price-up': btcIncrease,
            'CryptoTrendingCharts__chart-price-down': !btcIncrease,
          })}
        >
          (<FormattedNumber
            style="percent" // eslint-disable-line react/style-prop-object
            value={btcPriceDifferencePercent}
            minimumFractionDigits={2}
            maximumFractionDigits={2}
          />)
        </span>
        <i
          className={classNames('iconfont CryptoTrendingCharts__chart-caret', {
            'icon-caret-up': btcIncrease,
            'icon-caretbottom': !btcIncrease,
            'CryptoTrendingCharts__chart-price-up': btcIncrease,
            'CryptoTrendingCharts__chart-price-down': !btcIncrease,
          })}
        />
      </div>
    );
  }

  render() {
    const { renderDivider, cryptosPriceHistory } = this.props;
    const { currentCrypto, displayChart } = this.state;
    const usdAPIErrorKey = `${currentCrypto.symbol}.usdAPIError`;
    const usdAPIError = _.get(cryptosPriceHistory, usdAPIErrorKey, true);
    const cryptoUSDPriceHistoryKey = `${currentCrypto.symbol}.usdPriceHistory`;
    const usdPriceHistory = _.get(cryptosPriceHistory, cryptoUSDPriceHistoryKey, null);
    const loading = _.isNull(usdPriceHistory);

    if (loading) {
      return (
        <div>
          <div className="SidebarContentBlock__content">
            <Loading />
          </div>
          {renderDivider && <div className="SidebarContentBlock__divider" />}
        </div>
      );
    }

    if (_.isEmpty(currentCrypto) || usdAPIError) return null;

    return (
      <div>
        <div className="SidebarContentBlock__content">
          <div className="CryptoTrendingCharts__chart-header">
            <div className="CryptoTrendingCharts__crypto-name">
              {currentCrypto.name}
              <i
                role="presentation"
                onClick={() => this.toggleDisplayChart(!displayChart)}
                className={classNames('iconfont CryptoTrendingCharts__display-icon', {
                  'icon-unfold': !displayChart,
                  'icon-packup': displayChart,
                })}
              />
            </div>
            {this.renderUSDPrice()}
            {this.renderBTCPrice()}
          </div>
          {displayChart && this.renderRecharts()}
        </div>
        {renderDivider && <div className="SidebarContentBlock__divider" />}
      </div>
    );
  }
}

export default CryptoChart;
