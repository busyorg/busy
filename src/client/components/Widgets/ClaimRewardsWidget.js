import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import BaseWidget from './BaseWidget';
import Action from '../Button/Action';
import './ClaimRewardsWidget.less';

const currencies = {
  STEEM: {
    id: 'steem',
    defaultMessage: 'Steem',
  },
  SBD: {
    id: 'steem_dollar',
    defaultMessage: 'Steem Dollar',
  },
  SP: {
    id: 'steem_power',
    defaultMessage: 'Steem Power',
  },
};

function Reward({ value, currency }) {
  const data = currencies[currency];

  return (
    <div className="ClaimRewardsWidget__Reward">
      <FormattedMessage id={data.id} defaultMessage={data.defaultMessage} />
      <div>
        <FormattedNumber value={value} minimumFractionDigits={3} maximumFractionDigits={3} />{' '}
        {currency}
      </div>
    </div>
  );
}

Reward.propTypes = {
  value: PropTypes.number.isRequired,
  currency: PropTypes.oneOf(['STEEM', 'SBD', 'SP']).isRequired,
};

export default function ClaimRewardsWidget({ steem, sbd, sp, onClaim }) {
  return (
    <BaseWidget icon="icon-ranking" title="Rewards">
      {steem > 0 && <Reward value={steem} currency="STEEM" />}
      {sbd > 0 && <Reward value={sbd} currency="SBD" />}
      {sp > 0 && <Reward value={sp} currency="SP" />}
      <Action big className="ClaimRewardsWidget__action" onClick={onClaim}>
        <FormattedMessage id="claim_rewards" defaultMessage="Claim rewards" />
      </Action>
    </BaseWidget>
  );
}

ClaimRewardsWidget.propTypes = {
  steem: PropTypes.number.isRequired,
  sbd: PropTypes.number.isRequired,
  sp: PropTypes.number.isRequired,
  onClaim: PropTypes.func.isRequired,
};
