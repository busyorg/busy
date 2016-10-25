import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import './Messages.scss';
import Header from '../app/Header';
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
    ].sort().join('-');
    const channel = this.props.channels[channelName] || {
      latest: [],
      nmembers: 0,
    };
    return (
      <div className="Messages main-panel">
        <Header />
        <div className="secondary-nav">
          <i className="icon icon-sm material-icons">
            {_.has(this.props.favorites, username) ? 'star' : 'star_border'}
          </i>
          <Link to={`/@${username}`}>@{username}</Link>{' '}
          <span>{this.props.users[this.props.params.username] ?
            'online' : 'away'}
          </span>
        </div>
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
