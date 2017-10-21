import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import './Confirmation.less';

const Confirmation = ({ onConfirm, onCancel }) => (
  <div className="Confirmation">
    <a role="presentation" onClick={onConfirm}>
      <i className="iconfont icon-success" />
      <FormattedMessage id="confirm" defaultMessage="Confirm" />
    </a>
    <a role="presentation" onClick={onCancel}>
      <i className="iconfont icon-delete" />
      <FormattedMessage id="cancel" defaultMessage="Cancel" />
    </a>
  </div>
);

Confirmation.propTypes = {
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
};

Confirmation.defaultProps = {
  onConfirm: () => {},
  onCancel: () => {},
};

export default Confirmation;
