import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { FormattedRelative } from 'react-intl';
import { withRouter, Link } from 'react-router';
import _ from 'lodash';
import { connect } from 'react-redux';
import fetch from 'isomorphic-fetch';
import Avatar from '../widgets/Avatar';
import * as activityNotificationsActions from './activityNotificationActions';
import Loading from '../widgets/Loading'
import { makeNotificationTitle, uniqNotifications } from './activityNotificationHelpers';
import ActivityNotificationItem from './ActivityNotificationItem';
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
export default class ActivityNotification extends Component {
  componentDidMount() {
    const { activityNotification } = this.props;

    if (!activityNotification.isFetching) {
      this.props.fetchActivityNotifications();
    }
  }

  handleClick = (e, notification) => {
    e.stopPropagation();
    this.props.router.push(notification.url);
  }

  render() {
    const { activityNotification } = this.props;
    const { list, isFetching } = activityNotification;

    const listByNotificationId = _.groupBy(list, 'notification_id');

    return (
      <div>
        {isFetching && <Loading />}
        <div className="ActivityNotifList">
          {list && uniqNotifications(list).slice(0, 5).map((notification) =>
            <ActivityNotificationItem
              listByNotificationId={listByNotificationId}
              notification={notification}
              markAsSeen={this.props.markAsSeen}
              onClick={(e, notification) => this.handleClick(e, notification)}
            />
          )}
        </div>
        <Link to="/notifications" >See All</Link>
      </div>
    );
  }
}