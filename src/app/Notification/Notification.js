import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as notificationActions from './notificationActions';

import './Notification.scss';

@connect(
  state => ({
    notifications: state.notifications,
  })
)
export default class Notification extends Component {
  render() {
    return (
      <div className="NotificationHolder">

        { this.props.notifications.map(({ text }) =>
          <div className="Notification">
            { text }
          </div>
          )
        }

      </div>
    );
  }
}
