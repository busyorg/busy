import React, { PropTypes } from 'react';
import { Input } from 'antd';
import Avatar from '../Avatar';
import './CommentForm.less';

const CommentForm = ({ username, isSmall }) => (
  <div className="CommentForm">
    <Avatar username={username} size={(!isSmall) ? 40 : 32} />
    <div className="CommentForm__text">
      <Input type="textarea" placeholder="Write a comment" autosize={{ minRows: 2, maxRows: 6 }} />
      <button className="CommentForm__text__button">Comment</button>
    </div>
  </div>);

CommentForm.propTypes = {
  username: PropTypes.string.isRequired,
  isSmall: PropTypes.bool,
};

CommentForm.defaultProps = {
  isSmall: false,
};

export default CommentForm;
