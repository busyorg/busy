import React from 'react';
import { FormattedMessage } from 'react-intl';

const UserNotFound = () => (
  <div className="text-center my-5">
    <h3>
      <FormattedMessage id="user_not_found" defaultMessage="User not found" />
    </h3>
  </div>
);

export default UserNotFound;
