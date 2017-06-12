import React, { PropTypes } from 'react';
import { Input } from 'antd';
import Avatar from '../Avatar';
import './CommentForm.less';

const CommentForm = ({ username }) =>
  <div className="CommentForm">
    <Avatar username={username} size={40} />
    <Input type="textarea" placeholder="Write a comment" autosize={{ minRows: 2, maxRows: 6 }} />
  </div>;

CommentForm.propTypes = {
  username: PropTypes.string,
};

export default CommentForm;
