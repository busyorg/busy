import React from 'react';
import { injectIntl } from 'react-intl';
import { SimpleTooltipOrigin } from '../widgets/tooltip/SimpleTooltip';

const SteemPowerIcon = ({ active = true, className = '', intl }) =>
  (active
    ? <SimpleTooltipOrigin
      message={
        intl.formatMessage({
          id: 'full_steem_power',
          defaultMessage: '100% Steem Power',
        })}
    >
      <img
        className={className}
        style={{ height: '0.8em' }}
        src="/img/steem.svg"
      />
    </SimpleTooltipOrigin>
    : false);

export default injectIntl(SteemPowerIcon);
