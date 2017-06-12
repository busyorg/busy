import React, { PropTypes } from 'react';
import { Input } from 'antd';
import Avatar from '../Avatar';
import './CommentForm.less';

const CommentForm = ({ username }) =>
  <div className="CommentForm">
    <Avatar username={username} size={40} />
    <div className="CommentForm__text">
      <Input type="textarea" placeholder="Write a comment" autosize={{ minRows: 2, maxRows: 6 }} />
      <button className="CommentForm__text__button">Comment</button>
    </div>
  </div>;

CommentForm.propTypes = {
  username: PropTypes.string,
};

export default CommentForm;
