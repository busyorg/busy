import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import { getCryptoDetails } from '../../helpers/cryptosHelper';
import CryptoChart from './CryptoChart';
import './CryptoTrendingCharts.less';

class CryptoTrendingCharts extends React.Component {
  static propTypes = {
    crypto: PropTypes.string,
  };

  static defaultProps = {
    crypto: '',
  };

  constructor(props) {
    super(props);

    this.handleOnClickRefresh = this.handleOnClickRefresh.bind(this);
  }

  handleOnClickRefresh() {
    this.forceUpdate();
  }

  render() {
    const { crypto } = this.props;
    const currentCrypto = getCryptoDetails(crypto);

    if (_.isEmpty(currentCrypto)) return null;

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
        <CryptoChart crypto={crypto} />
      </div>
    );
  }
}

export default CryptoTrendingCharts;
