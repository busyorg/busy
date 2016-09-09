import React from 'react';

export default React.createClass({
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
      </form>
    );
  }
});
