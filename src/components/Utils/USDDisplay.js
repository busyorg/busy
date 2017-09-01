import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider, FormattedNumber } from 'react-intl';

const USDDisplay = ({ value }) => (
  <IntlProvider locale="en">
    <FormattedNumber
      value={value}
      // eslint-disable-next-line react/style-prop-object
      style="currency"
      currency="USD"
    />
  </IntlProvider>
);

USDDisplay.propTypes = {
  value: PropTypes.number,
};

USDDisplay.defaultProps = {
  value: 0,
};

export default USDDisplay;
