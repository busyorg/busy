import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { calculatePayout } from '../../vendor/steemitHelpers';
import BTooltip from '../BTooltip';
import USDDisplay from '../Utils/USDDisplay';
import PayoutDetail from '../PayoutDetail';
import './Payout.less';

const Payout = ({ intl, post }) => {
  const payout = calculatePayout(post);
  const payoutValue = payout.cashoutInTime ? payout.potentialPayout : payout.pastPayouts;

  return (
    payoutValue > 0.01 && (
      <span className="Payout">
        <BTooltip title={<PayoutDetail post={post} />}>
          <span
            className={classNames({
              'Payout--rejected': payout.isPayoutDeclined,
            })}
          >
            <USDDisplay value={payoutValue} />
          </span>
        </BTooltip>
        {post.percent_steem_dollars === 0 && (
          <BTooltip
            title={intl.formatMessage({
              id: 'reward_option_100',
              defaultMessage: '100% Steem Power',
            })}
          >
            <i className="iconfont icon-flashlight" />
          </BTooltip>
        )}
      </span>
    )
  );
};

Payout.propTypes = {
  intl: PropTypes.shape().isRequired,
  post: PropTypes.shape().isRequired,
};

export default injectIntl(Payout);
