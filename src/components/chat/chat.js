var React = require("react"),
	Header = require("./../../containers/header");

module.exports = React.createClass({
	getInitialState: function(){
		return {
			users: [],
			messages:[],
			text: ''
		};
	},
	componentDidMount: function(){
		var io = require('socket.io-client');
		var socket = io.connect('https://ws.busy6.com/');
		socket.on('send:message', this._messageRecieve);
		socket.on('user:join', this._userJoined);
		socket.on('user:left', this._userLeft);
		this.socket = socket;
	},
	_messageRecieve: function(message) {
		var {messages} = this.state;
		messages.push(message);
		this.setState({messages});
	},
	_userJoined: function(data) {
		var {users, messages} = this.state;
		var {name} = data;
		users.push(name);
		messages.push({
			user: 'APPLICATION BOT',
			text : name +' Joined'
		});
		this.setState({users, messages});
	},
	_userLeft: function(data) {
		var {users, messages} = this.state;
		var {name} = data;
		var index = users.indexOf(name);
		users.splice(index, 1);
		messages.push({
			user: 'APPLICATION BOT',
			text : name +' Left'
		});
		this.setState({users, messages});
	},
	handleMessageSubmit: function(message) {
		this.socket.emit('send:message', message);
	},
	render: function(){
		return (
			<div className="main-panel">
				<Header menu="chat" />
				<div className="chat">
					<UsersList users={this.state.users} />
					<MessageList messages={this.state.messages} />
					<MessageForm onMessageSubmit={this.handleMessageSubmit} user={this.state.user} />
				</div>
			</div>
		);
	}
});


var MessageForm = React.createClass({
	getInitialState() {
		return {text: ''};
	},
	handleSubmit(e) {
		e.preventDefault();
		var message = {
			user : this.props.user,
			text : this.state.text
		};
		this.props.onMessageSubmit(message);
		this.setState({ text: '' });
	},
	changeHandler(e) {
		this.setState({ text : e.target.value });
	},
	render() {
		return(
			<div className='message-form'>
				<h3>Write New Message</h3>
				<form onSubmit={this.handleSubmit}>
					<input onChange={this.changeHandler} value={this.state.text} />
				</form>
			</div>
		);
	}
});

var MessageList = React.createClass({
	render() {
		return (
			<div className='messages'>
				<h2> Conversation: </h2>
				{this.props.messages.map((message, i) => {
						return (<Message key={i} user={message.user} text={message.text} />);
					})}
			</div>
		);
	}
});

var Message = React.createClass({
	render() {
		return (
			<div className="message">
				<strong>{this.props.user} :</strong>
				<span>{this.props.text}</span>
			</div>
		);
	}
});

var UsersList = React.createClass({
	render() {
		return (
			<div className='users'>
				<h3> Online Users </h3>
				<ul>
					{this.props.users.map((user, i) => {
							return (<li key={i}>{user}</li>);
						})}
				</ul>
			</div>
		);
	}
});