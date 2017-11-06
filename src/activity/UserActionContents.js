import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as accountHistory from '../constants/accountHistory';

const UserActionContents = ({ actionType, actionDetails }) => {
  if (_.includes(accountHistory.PARSED_PROPERTIES, actionType)) {
    return null;
  }

  return (
    <table className="UserActivityActions__contents">
      <tbody>
        {_.map(actionDetails, (details, property) => (
          <tr className="UserActivityActions__contents__item" key={property}>
            <td className="UserActivityActions__contents__label">
              {property}
            </td>
            <td className="UserActivityActions__contents__value">
              {_.isObject(details)
                ? <pre>
                  <code>{JSON.stringify(details, null, 2)}</code>
                </pre>
                : details}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

UserActionContents.propTypes = {
  actionType: PropTypes.string.isRequired,
  actionDetails: PropTypes.shape().isRequired,
};

export default UserActionContents;
