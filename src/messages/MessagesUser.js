import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import './Messages.scss';
import Header from '../app/Header';
import MenuUser from '../app/Menu/MenuUser';
import MessageForm from './MessageForm';
import MessageList from './MessageList';
import actionDecorator from '../helpers/actionDecorator';
import { fetchChannelPresence, joinChannel } from './messagesActions';

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
    const username = this.props.params.username;
    const channelName = [
      `@${this.props.auth.user && this.props.auth.user.name}`,
      `@${this.props.params.username}`
    ].sort();
    const channel = this.props.channels[channelName] || {
      latest: [],
      nmembers: 0,
    };

    return (
      <div className="Messages main-panel">
        <Header />
        <MenuUser username={username} />
        <div className="messages">
          <MessageList
            username={username}
            messages={channel.latest}
          />
          <MessageForm
            channel={channelName}
            username={this.props.auth.user && this.props.auth.user.name}
          />
        </div>
      </div>
    );
  }
}

MessagesPage = actionDecorator(fetchChannelPresence, joinChannel)(MessagesPage, {
  waitFor: state => state.auth && state.auth.user && state.auth.user.name,
});

MessagesPage = connect(state => ({
  auth: state.auth,
  channels: state.messages.channels,
  users: state.messages.users,
  favorites: state.favorites,
}))(MessagesPage);

export default MessagesPage;
