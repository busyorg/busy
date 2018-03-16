import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import * as notificationConstants from '../../../../common/constants/notifications';
import { saveNotificationsLastTimestamp } from '../../../helpers/metadata';
import NotificationFollowing from './NotificationFollowing';
import NotificationReply from './NotificationReply';
import NotificationMention from './NotificationMention';
import NotificationVote from './NotificationVote';
import NotificationReblog from './NotificationReblog';
import NotificationTransfer from './NotificationTransfer';
import NotificationVoteWitness from './NotificationVoteWitness';
import './Notification.less';
import './Notifications.less';
import Loading from '../../Icon/Loading';

const displayLimit = 6;

class Notifications extends React.Component {
  static propTypes = {
    notifications: PropTypes.arrayOf(PropTypes.shape()),
    loadingNotifications: PropTypes.bool,
    lastSeenTimestamp: PropTypes.number,
    currentAuthUsername: PropTypes.string,
    onNotificationClick: PropTypes.func,
    getUpdatedSCUserMetadata: PropTypes.func,
  };

  static defaultProps = {
    notifications: [],
    loadingNotifications: false,
    lastSeenTimestamp: 0,
    currentAuthUsername: '',
    onNotificationClick: () => {},
    getUpdatedSCUserMetadata: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      displayedNotifications: _.slice(props.notifications, 0, displayLimit),
    };

    this.notificationsContent = null;

    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleNotificationsClick = this.handleNotificationsClick.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    const { notifications, lastSeenTimestamp } = this.props;
    const latestNotification = _.get(notifications, 0);
    const timestamp = _.get(latestNotification, 'timestamp');

    if (timestamp > lastSeenTimestamp) {
      saveNotificationsLastTimestamp(timestamp).then(() => this.props.getUpdatedSCUserMetadata());
    }
  }

  componentWillReceiveProps(nextProps) {
    const differentNotifications = !_.isEqual(
      _.size(this.props.notifications),
      _.size(nextProps.notifications),
    );
    const emptyDisplayedNotifications = _.isEmpty(this.state.displayedNotifications);

    if (differentNotifications || emptyDisplayedNotifications) {
      this.setState({
        displayedNotifications: _.slice(nextProps.notifications, 0, displayLimit),
      });
    } else {
      const latestNotification = _.get(nextProps.notifications, 0);
      const timestamp = _.get(latestNotification, 'timestamp');

      if (timestamp > nextProps.lastSeenTimestamp) {
        saveNotificationsLastTimestamp(timestamp).then(() => this.props.getUpdatedSCUserMetadata());
      }
    }
  }

  onScroll() {
    const { notifications } = this.props;
    const { displayedNotifications } = this.state;
    const contentElement = this.notificationsContent;
    const topScrollPos = contentElement.scrollTop;
    const totalContainerHeight = contentElement.scrollHeight;
    const containerFixedHeight = contentElement.offsetHeight;
    const bottomScrollPos = topScrollPos + containerFixedHeight;
    const bottomPosition = totalContainerHeight - bottomScrollPos;
    const threshold = 100;
    const hasMore = displayedNotifications.length !== notifications.length;

    if (bottomPosition < threshold && hasMore) {
      this.handleLoadMore();
    }
  }

  handleLoadMore() {
    const { notifications } = this.props;
    const { displayedNotifications } = this.state;
    const moreNotificationsStartIndex = displayedNotifications.length;
    const moreNotifications = _.slice(
      notifications,
      moreNotificationsStartIndex,
      moreNotificationsStartIndex + displayLimit,
    );
    this.setState({
      displayedNotifications: displayedNotifications.concat(moreNotifications),
    });
  }

  handleNotificationsClick(e) {
    const openedInNewTab = _.get(e, 'metaKey', false) || _.get(e, 'ctrlKey', false);
    if (!openedInNewTab) {
      this.props.onNotificationClick();
    }
  }

  render() {
    const {
      notifications,
      currentAuthUsername,
      lastSeenTimestamp,
      onNotificationClick,
      loadingNotifications,
    } = this.props;
    const { displayedNotifications } = this.state;
    const displayEmptyNotifications = _.isEmpty(notifications) && !loadingNotifications;

    return (
      <div className="Notifications">
        <div
          className="Notifications__content"
          onScroll={this.onScroll}
          ref={element => {
            this.notificationsContent = element;
          }}
        >
          {loadingNotifications && <Loading style={{ padding: 20 }} />}
          {_.map(displayedNotifications, (notification, index) => {
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
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.FOLLOW:
                return (
                  <NotificationFollowing
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.MENTION:
                return (
                  <NotificationMention
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.VOTE:
                return (
                  <NotificationVote
                    key={key}
                    notification={notification}
                    read={read}
                    currentAuthUsername={currentAuthUsername}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.REBLOG:
                return (
                  <NotificationReblog
                    key={key}
                    notification={notification}
                    read={read}
                    currentAuthUsername={currentAuthUsername}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.TRANSFER:
                return (
                  <NotificationTransfer
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.WITNESS_VOTE:
                return (
                  <NotificationVoteWitness
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              default:
                return null;
            }
          })}
          {displayEmptyNotifications && (
            <div className="Notification Notification__empty">
              <FormattedMessage
                id="notifications_empty_message"
                defaultMessage="You currently have no notifications."
              />
            </div>
          )}
        </div>
        <div className="Notifications__footer">
          <Link to="/notifications" onClick={onNotificationClick}>
            <FormattedMessage id="see_all" defaultMessage="See All" />
          </Link>
        </div>
      </div>
    );
  }
}

export default Notifications;
