import React from 'react';
import Header from './../app/header';
import MessageForm from './MessageForm';
import MessageList from './MessageList';
import Message from './Message';

export default React.createClass({
  getInitialState: function(){
    return {
      users: [],
      messages:[],
      text: ''
    };
  },

  componentDidMount: function(){
    document.title = 'Messages | Busy';
    var io = require('socket.io-client');
    var socket = io.connect('https://ws.busy6.com/');
    socket.on('send:message', this._messageRecieve);
    socket.on('user:join', this._userJoined);
    socket.on('user:left', this._userLeft);
    this.socket = socket;
  },

  _messageRecieve: function(message) {
    var messages = this.state.messages;
    messages.push(message);
    this.setState({messages: messages});
  },

  _userJoined: function(data) {
    var users = this.state.users;
    var messages = this.state.messages;
    var name = data.name;
    users.push(name);
    messages.push({
      user: 'bot',
      text : name +' joined.'
    });
    this.setState({users: users, messages: messages});
  },

  _userLeft: function(data) {
    var users = this.state.users;
    var messages = this.state.messages;
    var name = data.name;
    var index = users.indexOf(name);
    users.splice(index, 1);
    messages.push({
      user: 'bot',
      text : name +' left.'
    });
    this.setState({users: users, messages: messages});
  },

  handleMessageSubmit: function(message) {
    this.socket.emit('send:message', message);
  },

  render: function(){
    return (
      <div className="main-panel">
        <Header menu="messages" />
        <div className="messages">
          <MessageList messages={this.state.messages} />
          <MessageForm onMessageSubmit={this.handleMessageSubmit} user={this.state.user} />
        </div>
      </div>
    );
  }
});
