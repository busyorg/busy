import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import { calculatePayout } from '../../vendor/steemitHelpers';
import USDDisplay from '../Utils/USDDisplay';
import PayoutDetail from '../PayoutDetail';
import './Payout.less';

const Payout = ({ intl, post }) => {
  const payout = calculatePayout(post);

  return (
    <span className="Payout">
      <Tooltip title={<PayoutDetail post={post} />}>
        <span
          className={classNames({
            'Payout--rejected': payout.isPayoutDeclined,
          })}
        >
          <USDDisplay value={payout.cashoutInTime ? payout.potentialPayout : payout.pastPayouts} />
        </span>
      </Tooltip>
      {post.percent_steem_dollars === 0 && (
        <Tooltip
          title={intl.formatMessage({
            id: 'reward_option_100',
            defaultMessage: '100% Steem Power',
          })}
        >
          <i className="iconfont icon-flashlight" />
        </Tooltip>
      )}
    </span>
  );
};

Payout.propTypes = {
  intl: PropTypes.shape().isRequired,
  post: PropTypes.shape().isRequired,
};

export default injectIntl(Payout);
