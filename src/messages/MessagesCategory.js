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
    params: PropTypes.object,
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
    const category = this.props.params.category;
    const channel = this.props.channels[category] || {
        latest: [],
        nmembers: 0,
      };
    return (
      <div className="Messages main-panel">
        <Header menu="messages">
          <div><i className="icon icon-sm material-icons">star_border</i> <Link to={`/trending/${category}`}>#{category}</Link> <span>{channel.nmembers} online</span></div>
        </Header>
        <div className="messages">
          <MessageList messages={channel.latest} />
          <MessageForm
            channel={category}
            username={this.props.auth.user && this.props.auth.user.name}
          />
        </div>
      </div>
    );
  }
}

MessagesPage = actionDecorator(fetchChannelPresence, joinChannel)(MessagesPage);
MessagesPage = connect((state) => ({
  auth: state.auth,
  channels: state.messages.channels,
}))(MessagesPage);

export default MessagesPage;
