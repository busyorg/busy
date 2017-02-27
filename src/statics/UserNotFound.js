import React from 'react';
import { FormattedMessage } from 'react-intl';

const UserNotFound = () =>
  <div className="text-center">
    <h3>
      <FormattedMessage id="user_not_found" />
    </h3>
  </div>;

export default UserNotFound;
