import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

const DMCARemovedMessage = ({ className }) => (
  <div className={className}>
    <h3>
      <FormattedMessage
        id="dmca_content_removed"
        defaultMessage="Content removed due to DMCA notice"
      />
    </h3>
  </div>
);

DMCARemovedMessage.propTypes = {
  className: PropTypes.string,
};

DMCARemovedMessage.defaultProps = {
  className: 'Story__warning__message',
};

export default DMCARemovedMessage;
