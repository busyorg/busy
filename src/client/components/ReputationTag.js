import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Tag } from 'antd';
import BTooltip from './BTooltip';
import formatter from '../helpers/steemitFormatter';

function ReputationTag({ intl, reputation }) {
  const formattedReputation = formatter.reputationFloat(reputation);

  return (
    <BTooltip
      title={intl.formatMessage(
        { id: 'reputation_score_value', defaultMessage: 'Reputation score: {value}' },
        { value: formattedReputation.toFixed(3) },
      )}
    >
      <Tag>{Math.floor(formattedReputation)}</Tag>
    </BTooltip>
  );
}

ReputationTag.propTypes = {
  intl: PropTypes.shape().isRequired,
  reputation: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default injectIntl(ReputationTag);
