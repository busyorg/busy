import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as accountHistory from '../constants/accountHistory';

class UserActionContents extends React.Component {
  static propTypes = {
    actionType: PropTypes.string.isRequired,
    actionDetails: PropTypes.shape().isRequired,
  };

  renderContents() {
    const { actionType, actionDetails } = this.props;
    switch (actionType) {
      case accountHistory.ACCOUNT_UPDATE: {
        const accountUpdateProperties = ['account', 'posting', 'memo_key', 'json_metadata'];
        const accountUpdateContents = [];
        _.each(accountUpdateProperties, (accountProperty) => {
          if (_.has(actionDetails, accountProperty)) {
            accountUpdateContents.push(
              <tr className="UserActivityActions__contents__item" key={accountProperty}>
                <td className="UserActivityActions__contents__label">
                  {accountProperty}
                </td>
                <td className="UserActivityActions__contents__value">
                  {_.isObject(actionDetails[accountProperty])
                    ? <pre>
                      <code>{JSON.stringify(actionDetails[accountProperty], null, 2)}</code>
                    </pre>
                    : actionDetails[accountProperty]}
                </td>
              </tr>,
            );
          }
        });
        return accountUpdateContents;
      }
      default:
        return null;
    }
  }

  render() {
    const contents = this.renderContents();

    if (contents) {
      return (
        <table className="UserActivityActions__contents">
          <tbody>
            {this.renderContents()}
          </tbody>
        </table>
      );
    }

    return null;
  }
}

export default UserActionContents;
