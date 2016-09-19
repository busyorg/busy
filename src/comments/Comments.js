import React, { Component } from 'react';
import CommentsList from './CommentsList';

export default class Comments extends Component {
  render() {
    return (
      <div>
        <CommentsList commentsToShow={10} />
      </div>
    );
  }
}
