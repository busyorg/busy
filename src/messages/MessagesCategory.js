import _ from 'lodash';
import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import dispatchActions from '../helpers/dispatchActions';
import MessageForm from './MessageForm';
import MessageList from './MessageList';
import MenuFeed from '../app/Menu/MenuFeed';
import { fetchChannelPresence, joinChannel } from './messagesActions';
import './Messages.less';

@withRouter
@dispatchActions(
  {
    waitFor: state => state.auth && state.auth.isAuthenticated
  },
  ownProps => ({
    fetchChannelPresence: () => fetchChannelPresence(_.get(ownProps.match, 'params.category')),
    joinChannel: () => joinChannel(_.get(ownProps.match, 'params.category'))
  })
)
@connect(
  state => ({
    auth: state.auth,
    channels: state.messages.channels,
    isLoading: state.messages.isLoading,
    favorites: state.favorites,
    isConnected: state.messages.isConnected
  }),
  {
    fetchMoreMessages: ({ params, channels }) =>
      fetchChannelPresence(params.category, {
        offset: channels[params.category] ? +channels[params.category].offset + 40 : 0
      })
  }
)
export default class MessagesCategory extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      messages: [],
      text: ''
    };
  }

  render() {
    const category = this.props.match.params.category;
    const channel = this.props.channels[category] || {
      latest: [],
      nmembers: 0
    };

    return (
      <div className="Messages main-panel">
        <MenuFeed auth={this.props.auth} category={category === 'general' ? '' : category} />
        <div className="messages">
          <MessageList
            key="message-list"
            messages={channel.latest}
            isLoading={this.props.isLoading}
            fetchMoreMessages={() => this.props.fetchMoreMessages(this.props)}
            hasMore={channel.hasMore}
          />

          {this.props.isConnected &&
            <MessageForm
              channel={category}
              username={this.props.auth.user && this.props.auth.user.name}
            />}

        </div>
      </div>
    );
  }
}
