import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';

// eslint-disable-next-line react/style-prop-object
const USDDisplay = ({ value }) => <FormattedNumber value={value} style="currency" currency="USD" />;

USDDisplay.propTypes = {
  value: PropTypes.number,
};

USDDisplay.defaultProps = {
  value: 0,
};

export default USDDisplay;
