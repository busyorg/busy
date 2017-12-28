import React from 'react';
import { FormattedMessage } from 'react-intl';

const EmptyUserProfile = () => (
  <div className="text-center">
    <h3>
      <FormattedMessage
        id="empty_user_profile"
        defaultMessage="This user doesn't have any story published yet."
      />
    </h3>
  </div>
);

export default EmptyUserProfile;
