import React from 'react';
import { FormattedMessage } from 'react-intl';

const DMCARemovedMessage = () => (
  <div className="Story__warning__message">
    <h4>
      <FormattedMessage
        id="dmca_content_removed"
        defaultMessage="Content removed due to DMCA notice"
      />
    </h4>
  </div>
);

export default DMCARemovedMessage;
