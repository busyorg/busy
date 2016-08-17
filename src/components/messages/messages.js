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
		document.title = 'Messages | Busy';
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
			user: 'bot',
			text : name +' joined.'
		});
		this.setState({users, messages});
	},
	_userLeft: function(data) {
		var {users, messages} = this.state;
		var {name} = data;
		var index = users.indexOf(name);
		users.splice(index, 1);
		messages.push({
			user: 'bot',
			text : name +' left.'
		});
		this.setState({users, messages});
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
		return(<form className="container message-form" onSubmit={this.handleSubmit}>
					<input onChange={this.changeHandler} value={this.state.text} />
				</form>);
	}
});

var MessageList = React.createClass({
	render() {
		return (
			<div className="messages-content">
				<div className="container">
					<ul>
						{this.props.messages.map((message, i) => {
								return (<Message key={i} user={message.user} text={message.text} />);
							})}
					</ul>
				</div>
			</div>
		);
	}
});

var Message = React.createClass({
	render() {
		return (
			<li className="message">
				<span><b>@{this.props.user}</b>: {this.props.text}</span>
			</li>
		);
	}
});