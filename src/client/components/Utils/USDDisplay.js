import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';

const USDDisplay = ({ value }) => {
  const negative = value.toFixed(2) < 0;
  const absValue = Math.abs(value);
  const precision = absValue < 0.02 && value > 0 ? 3 : 2;
  return (
    <span>
      {negative && '-'}
      {'$'}
      <FormattedNumber
        value={absValue}
        minimumFractionDigits={precision}
        maximumFractionDigits={precision}
      />
    </span>
  );
};

USDDisplay.propTypes = {
  value: PropTypes.number,
};

USDDisplay.defaultProps = {
  value: 0,
};

export default USDDisplay;
