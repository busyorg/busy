import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';

const USDDisplay = ({ value }) => (
  <span>
    {'$'}
    <FormattedNumber value={value} minimumFractionDigits={2} maximumFractionDigits={2} />
  </span>
);

USDDisplay.propTypes = {
  value: PropTypes.number,
};

USDDisplay.defaultProps = {
  value: 0,
};

export default USDDisplay;
