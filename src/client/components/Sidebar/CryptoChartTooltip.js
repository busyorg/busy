import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import USDDisplay from '../../components/Utils/USDDisplay';

const CryptoChartTooltip = ({ payload }) => {
  const priceDetails = _.get(payload, 0, {});
  const priceValue = _.get(priceDetails, 'value', 0);
  return (
    <div className="CryptoTrendingCharts__tooltip-container">
      <USDDisplay value={priceValue} />
    </div>
  );
};

CryptoChartTooltip.propTypes = {
  payload: PropTypes.arrayOf(PropTypes.shape()),
};

CryptoChartTooltip.defaultProps = {
  payload: [],
};

export default CryptoChartTooltip;
