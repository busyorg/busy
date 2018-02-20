import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import * as notificationConstants from '../../../../common/constants/notifications';
import { saveNotificationsLastTimestamp } from '../../../helpers/metadata';
import NotificationFollowing from './NotificationFollowing';
import NotificationReply from './NotificationReply';
import NotificationMention from './NotificationMention';
import './Notification.less';
import './Notifications.less';

class Notifications extends React.Component {
  static propTypes = {
    notifications: PropTypes.arrayOf(PropTypes.shape()),
    currentAuthUsername: PropTypes.string,
    lastSeenTimestamp: PropTypes.number,
    onClick: PropTypes.func,
    onSeeAllClick: PropTypes.func,
  };

  static defaultProps = {
    notifications: [],
    currentAuthUsername: '',
    lastSeenTimestamp: 0,
    onClick: () => {},
    onSeeAllClick: () => {},
  };

  componentDidMount() {
    const { notifications } = this.props;
    const latestNotification = _.get(notifications, 0);
    const timestamp = _.get(latestNotification, 'timestamp');
    saveNotificationsLastTimestamp(timestamp);
  }

  render() {
    const {
      onClick,
      onSeeAllClick,
      notifications,
      currentAuthUsername,
      lastSeenTimestamp,
    } = this.props;

    return (
      <div className="Notifications">
        <div className="Notifications__content">
          {_.map(notifications, (notification, index) => {
            const key = `${index}${notification.timestamp}`;
            const read = lastSeenTimestamp >= notification.timestamp;
            switch (notification.type) {
              case notificationConstants.REPLY:
                return (
                  <NotificationReply
                    key={key}
                    onClick={onClick}
                    notification={notification}
                    currentAuthUsername={currentAuthUsername}
                    read={read}
                  />
                );
              case notificationConstants.FOLLOW:
                return (
                  <NotificationFollowing
                    key={key}
                    onClick={onClick}
                    notification={notification}
                    read={read}
                  />
                );
              case notificationConstants.MENTION:
                return (
                  <NotificationMention
                    key={key}
                    onClick={onClick}
                    notification={notification}
                    read={read}
                  />
                );
              default:
                return null;
            }
          })}
          {_.isEmpty(notifications) && (
            <div className="Notification Notification__empty">
              <FormattedMessage
                id="notifications_empty_message"
                defaultMessage="You currently have no notifications."
              />
            </div>
          )}
        </div>
        <div className="Notifications__footer">
          <a role="presentation" onClick={onSeeAllClick}>
            <FormattedMessage id="see_all" defaultMessage="See All" />
          </a>
        </div>
      </div>
    );
  }
}

export default Notifications;
