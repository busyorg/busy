import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';
import keycode from 'keycode';

import './CommentForm.scss';

export default class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: ''
    };
  }

  handleChange = (e) => {
    this.setState({ comment: e.target.value });
  };

  handleKey(e) {
    if(keycode(e) === 'enter' && !e.shiftKey) {
      // submit
    }
  }

  render() {
    return (
      <div className={'CommentForm'}>
        <Textarea
          rows={1}
          autoFocus
          className={'CommentForm__input'}
          onKeyDown={this.handleKey}
          onChange={this.handleChange}
          placeholder={'Write a comment...'}
        />
      </div>
    );
  }
}
