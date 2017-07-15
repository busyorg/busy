import React, { Component, PropTypes } from 'react';
import { Input } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Avatar from '../Avatar';
import * as commentActions from '../../comments/commentsActions';
import { notify } from '../../app/Notification/notificationActions';
import './CommentForm.less';

@connect(
  null,
  dispatch => bindActionCreators({
    sendComment: (parentPost, body) => commentActions.sendCommentV2(parentPost, body),
    notify,
  }, dispatch)
)

class CommentForm extends Component {

  state = {
    inputValue: '',
  }

  handleCommentTextChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }

  handleSubmit = (e) => {
    e.stopPropagation();
    if (this.state.inputValue) {
      this.props.sendComment(this.props.parentPost, this.state.inputValue).then(() => {
        this.props.notify('Comment submitted successfully', 'success');
      });
    }
  }

  render() {
    const { username, isSmall } = this.props;
    return (
      <div className="CommentForm">
        <Avatar username={username} size={(!isSmall) ? 40 : 32} />
        <div className="CommentForm__text">
          <Input
            ref={(c) => { this._input = c; }}
            type="textarea"
            value={this.state.inputValue}
            onChange={this.handleCommentTextChange}
            placeholder="Write a comment"
            autosize={{ minRows: 2, maxRows: 6 }}
          />
          <button
            onClick={this.handleSubmit}
            className="CommentForm__text__button"
          >
            Comment
          </button>
        </div>
      </div>
    );
  }
}

CommentForm.propTypes = {
  parentPost: PropTypes.shape().isRequired,
  username: PropTypes.string.isRequired,
  isSmall: PropTypes.bool,
};

CommentForm.defaultProps = {
  isSmall: false,
};

export default CommentForm;
