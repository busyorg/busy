var React = require("react"),
	Header = require("./../containers/header");

module.exports = React.createClass({
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


var MessageForm = React.createClass({
	getInitialState: function() {
		return {text: ''};
	},
	handleSubmit: function(e) {
		e.preventDefault();
		var message = {
			user : this.props.user,
			text : this.state.text
		};
		this.props.onMessageSubmit(message);
		this.setState({ text: '' });
	},
	changeHandler: function(e) {
		this.setState({ text : e.target.value });
	},
	render: function() {
		return(
			<form className="message-form" onSubmit={this.handleSubmit}>
				<div className="container">
					<textarea autoFocus className="pas" onChange={this.changeHandler} value={this.state.text} />
				</div>
			</form>);
	}
});

var MessageList = React.createClass({
	render: function() {
		return (
			<div className="messages-content">
				<div className="container">
					<ul>
						{this.props.messages.map(function(message, i) {
							return (<Message key={i} user={message.user} text={message.text} />);
						})}
					</ul>
				</div>
			</div>
		);
	}
});

var Message = React.createClass({
	render: function() {
		return (
			<li className="message">
				<span><b>@{this.props.user}</b>: {this.props.text}</span>
			</li>
		);
	}
});
