import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { notification } from 'antd';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { getAuthenticatedUserName, getLatestNotification } from '../reducers';
import {
  getNotificationsMessage,
  getNotificationsLink,
  getNotificationsAvatar,
} from '../helpers/notificationsHelper';
import { epochToUTC } from '../helpers/formatter';
import Avatar from '../components/Avatar';
import './NotificationPopup.less';

@withRouter
@injectIntl
@connect(state => ({
  currentAuthUsername: getAuthenticatedUserName(state),
  latestNotification: getLatestNotification(state),
}))
class NotificationPopup extends Component {
  static propTypes = {
    latestNotification: PropTypes.shape(),
    intl: PropTypes.shape(),
    currentAuthUsername: PropTypes.string,
    history: PropTypes.shape(),
  };

  static defaultProps = {
    latestNotification: {},
    history: {},
    intl: {},
    currentAuthUsername: '',
  };

  constructor(props) {
    super(props);

    this.navigateToNotification = this.navigateToNotification.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const diffNotification = !_.isEqual(
      JSON.stringify(nextProps.latestNotification),
      JSON.stringify(this.props.latestNotification),
    );

    if (diffNotification) {
      const { latestNotification, currentAuthUsername } = nextProps;
      const key = `open${Date.now()}`;
      const username = getNotificationsAvatar(latestNotification, '');
      notification.open({
        message: (
          <a
            role="presentation"
            onClick={() => {
              this.navigateToNotification(latestNotification);
              notification.close(key);
            }}
          >
            <span className="username">{username}</span>
            {getNotificationsMessage(latestNotification, this.props.intl)}
          </a>
        ),
        description: this.props.intl.formatRelative(epochToUTC(latestNotification.timestamp)),
        placement: 'bottomLeft',
        icon: (
          <a
            role="presentation"
            onClick={() => {
              this.navigateToNotification(latestNotification);
              notification.close(key);
            }}
          >
            <Avatar
              username={getNotificationsAvatar(latestNotification, currentAuthUsername)}
              size={40}
            />
          </a>
        ),
        duration: 5,
        key,
        className: 'NotificationPopup',
      });
    }
  }

  navigateToNotification(latestNotification) {
    const { history, currentAuthUsername } = this.props;
    history.push(getNotificationsLink(latestNotification, currentAuthUsername));
  }

  render() {
    return <div />;
  }
}

export default NotificationPopup;
