import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import Affix from '../components/Utils/Affix';
import * as notificationConstants from '../../common/constants/notifications';
import { getUpdatedSCUserMetadata } from '../auth/authActions';
import { getNotifications } from '../user/userActions';
import {
  getAuthenticatedUserSCMetaData,
  getNotifications as getNotificationsState,
  getIsLoadingNotifications,
  getAuthenticatedUserName,
} from '../reducers';
import requiresLogin from '../auth/requiresLogin';
import NotificationReply from '../components/Navigation/Notifications/NotificationReply';
import NotificationMention from '../components/Navigation/Notifications/NotificationMention';
import NotificationFollowing from '../components/Navigation/Notifications/NotificationFollowing';
import NotificationVote from '../components/Navigation/Notifications/NotificationVote';
import NotificationReblog from '../components/Navigation/Notifications/NotificationReblog';
import NotificationTransfer from '../components/Navigation/Notifications/NotificationTransfer';
import NotificationVoteWitness from '../components/Navigation/Notifications/NotificationVoteWitness';
import Loading from '../components/Icon/Loading';
import './Notifications.less';

class Notifications extends React.Component {
  static propTypes = {
    loadingNotifications: PropTypes.bool.isRequired,
    getUpdatedSCUserMetadata: PropTypes.func.isRequired,
    getNotifications: PropTypes.func.isRequired,
    notifications: PropTypes.arrayOf(PropTypes.shape()),
    currentAuthUsername: PropTypes.string,
    userSCMetaData: PropTypes.shape(),
  };

  static defaultProps = {
    notifications: [],
    currentAuthUsername: '',
    userSCMetaData: {},
  };

  componentDidMount() {
    const { userSCMetaData, notifications } = this.props;

    if (_.isEmpty(userSCMetaData)) {
      this.props.getUpdatedSCUserMetadata();
    }

    if (_.isEmpty(notifications)) {
      this.props.getNotifications();
    }
  }

  render() {
    const { notifications, currentAuthUsername, userSCMetaData, loadingNotifications } = this.props;
    const lastSeenTimestamp = _.get(userSCMetaData, 'notifications_last_timestamp');

    return (
      <div className="shifted">
        <div className="feed-layout container">
          <Affix className="leftContainer" stickPosition={77}>
            <div className="left">
              <LeftSidebar />
            </div>
          </Affix>
          <div className="NotificationsPage">
            <div className="NotificationsPage__title">
              <h1>
                <FormattedMessage id="notifications" defaultMessage="Notifications" />
              </h1>
            </div>
            <div className="NotificationsPage__content">
              {loadingNotifications && (
                <div className="NotificationsPage__loading">
                  <Loading />
                </div>
              )}
              {_.map(notifications, (notification, index) => {
                const key = `${index}${notification.timestamp}`;
                const read = lastSeenTimestamp >= notification.timestamp;
                switch (notification.type) {
                  case notificationConstants.REPLY:
                    return (
                      <NotificationReply
                        key={key}
                        notification={notification}
                        currentAuthUsername={currentAuthUsername}
                        read={read}
                      />
                    );
                  case notificationConstants.FOLLOW:
                    return (
                      <NotificationFollowing key={key} notification={notification} read={read} />
                    );
                  case notificationConstants.MENTION:
                    return (
                      <NotificationMention key={key} notification={notification} read={read} />
                    );
                  case notificationConstants.VOTE:
                    return (
                      <NotificationVote
                        key={key}
                        notification={notification}
                        read={read}
                        currentAuthUsername={currentAuthUsername}
                      />
                    );
                  case notificationConstants.REBLOG:
                    return (
                      <NotificationReblog
                        key={key}
                        notification={notification}
                        read={read}
                        currentAuthUsername={currentAuthUsername}
                      />
                    );
                  case notificationConstants.TRANSFER:
                    return (
                      <NotificationTransfer key={key} notification={notification} read={read} />
                    );
                  case notificationConstants.WITNESS_VOTE:
                    return (
                      <NotificationVoteWitness key={key} notification={notification} read={read} />
                    );
                  default:
                    return null;
                }
              })}
              {_.isEmpty(notifications) &&
                !loadingNotifications && (
                  <div className="Notification Notification__empty">
                    <FormattedMessage
                      id="notifications_empty_message"
                      defaultMessage="You currently have no notifications."
                    />
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    notifications: getNotificationsState(state),
    userSCMetaData: getAuthenticatedUserSCMetaData(state),
    currentAuthUsername: getAuthenticatedUserName(state),
    loadingNotifications: getIsLoadingNotifications(state),
  }),
  {
    getUpdatedSCUserMetadata,
    getNotifications,
  },
)(requiresLogin(Notifications));
