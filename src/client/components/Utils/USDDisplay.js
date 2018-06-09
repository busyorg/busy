import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';

const USDDisplay = ({ value }) => {
  const negative = value.toFixed(2) < 0;
  const absValue = Math.abs(value);
  return (
    <span>
      {negative && '-'}
      {'$'}
      <FormattedNumber value={absValue} minimumFractionDigits={2} maximumFractionDigits={2} />
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
