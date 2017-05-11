import React from 'react';
import { injectIntl } from 'react-intl';
import { SimpleTooltipOrigin } from '../widgets/tooltip/SimpleTooltip';

const SteemPowerIcon = ({ active = true, className = '', intl }) =>
  <SimpleTooltipOrigin
    message={
      intl.formatMessage({
        id: 'full_steem_power',
        defaultMessage: '100% Steem Power'
      })}
  >
    <img
      className={className}
      style={{ height: '0.8em' }}
      src="/img/steem.svg"
    />
  </SimpleTooltipOrigin>;

export default injectIntl(SteemPowerIcon);
