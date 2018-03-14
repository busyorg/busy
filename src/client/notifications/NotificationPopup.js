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
import Avatar from '../components/Avatar';

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
      notification.open({
        message: (
          <a
            role="presentation"
            onClick={() => this.navigateToNotification(nextProps.latestNotification)}
          >
            {getNotificationsMessage(nextProps.latestNotification, this.props.intl)}
          </a>
        ),
        description: '',
        placement: 'bottomLeft',
        icon: (
          <Avatar
            username={getNotificationsAvatar(
              nextProps.latestNotification,
              nextProps.currentAuthUsername,
            )}
            size={30}
          />
        ),
        duration: 0,
      });
    }
  }

  navigateToNotification(latestNotification) {
    const { history, currentAuthUsername } = this.props;
    history.push(getNotificationsLink(latestNotification), currentAuthUsername);
  }

  render() {
    return <div />;
  }
}

export default NotificationPopup;
