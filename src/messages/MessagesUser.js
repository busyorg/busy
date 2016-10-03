import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import './Messages.scss';
import Header from './../app/header';
import MessageForm from './MessageForm';
import MessageList from './MessageList';
import actionDecorator from '../lib/actionDecorator';
import { fetchChannelPresence, joinChannel } from '../common/messages/actions';

class MessagesPage extends Component {
  static propTypes = {
    auth: PropTypes.object,
    params: PropTypes.shape({
      username: PropTypes.string,
    }),
    channels: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      messages: [],
      text: '',
    };
  }
  render() {
    const channelName = `@${this.props.params.username}`;
    const channel = this.props.channels[channelName] || {
      latest: [],
      nmembers: 0,
    };
    return (
      <div className="Messages main-panel">
        <Header menu="messages">
          <div>
            <i className="icon icon-sm material-icons">star_border</i>
            <Link to={`/${channelName}`}>
              {channelName}
            </Link>
            {' '}
            <span>
              {this.props.users[this.props.params.username]
                ? 'online'
                : 'away'
              }
            </span>
          </div>
        </Header>
        <div className="messages">
          <MessageList messages={channel.latest} />
          <MessageForm
            channel={channelName}
            username={this.props.auth.user && this.props.auth.user.name}
          />
        </div>
      </div>
    );
  }
}

MessagesPage = actionDecorator(fetchChannelPresence, joinChannel)(MessagesPage);
MessagesPage = connect(state => ({
  auth: state.auth,
  channels: state.messages.channels,
  users: state.messages.users,
}))(MessagesPage);

export default MessagesPage;
