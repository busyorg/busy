import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as accountHistory from '../../common/constants/accountHistory';

const UserActionContents = ({ actionType, actionDetails }) => {
  if (actionType === accountHistory.CUSTOM_JSON) {
    // Special case: Follow, Unfollow, Reblog, Mute operations are
    // a part of custom json operations with actionDetails.id as "follow".
    // We have a parser for these ops, however we cannot parse
    // every custom json since it's flexible and there is no
    // standard for the structure of custom_json ops.
    if (_.includes(accountHistory.PARSED_CUSTOM_JSON_IDS, actionDetails.id)) {
      return null;
    }
  } else if (_.includes(accountHistory.PARSED_PROPERTIES, actionType)) {
    return null;
  }

  return (
    <table className="UserActivityActions__contents">
      <tbody>
        {_.map(actionDetails, (details, property) => (
          <tr className="UserActivityActions__contents__item" key={property}>
            <td className="UserActivityActions__contents__label">
              <div>{property}</div>
            </td>
            <td className="UserActivityActions__contents__value">
              <pre>{JSON.stringify(details, null, 2)}</pre>
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
