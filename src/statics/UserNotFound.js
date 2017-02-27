import React from 'react';
import { FormattedMessage } from 'react-intl';

const UserNotFound = () =>
  <strong className="text-center w-100 p-5">
    <FormattedMessage id="user_not_found" />
  </strong>;

export default UserNotFound;
