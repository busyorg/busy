import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { FormattedRelative } from 'react-intl';
import { withRouter, Link } from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';
import fetch from 'isomorphic-fetch';
import Avatar from '../widgets/Avatar';
import * as activityNotificationsActions from './activityNotificationActions';
import { makeNotificationTitle, uniqNotifications } from './activityNotificationHelpers';
import ActivityNotificationAllItem from './ActivityNotificationAllItem';
import Loading from '../widgets/Loading'
import './ActivityNotification.scss';

@connect(
  ({ activityNotification }) => ({
    activityNotification,
  }),
  (dispatch) => bindActionCreators({
    markAsSeen: activityNotificationsActions.markAsSeen,
    fetchActivityNotifications: activityNotificationsActions.fetchActivityNotifications,
  }, dispatch)
)
@withRouter
export default class ActivityNotificationAll extends Component {
  componentDidMount() {
    this.props.fetchActivityNotifications(50);
  }

  render() {
    const { activityNotification } = this.props;
    const { list } = activityNotification;
    const listByNotificationId = _.groupBy(list, 'notification_id');

    return (
      <div className="main-panel">
        <div className="ActivityNotifList ActivityNotifList--all">
           {list && uniqNotifications(list).map((notification) =>
            <ActivityNotificationAllItem
              listByNotificationId={listByNotificationId}
              notification={notification}
              markAsSeen={this.props.markAsSeen}
            />
          )}
        </div>
      </div>
    );
  }
}
