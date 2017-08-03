import React, { Component, PropTypes } from 'react';
import { Input, Icon } from 'antd';
import Avatar from '../Avatar';
import './CommentForm.less';

class CommentForm extends Component {

  state = {
    inputValue: this.props.inputValue,
    isDisabledSubmit: false,
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isLoading) {
      this.setState({ inputValue: nextProps.inputValue || '' });
    }
  }

  handleCommentTextChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }

  handleSubmit = (e) => {
    e.stopPropagation();
    this.setState({ isDisabledSubmit: true });
    if (this.state.inputValue) {
      this.props.onSubmit(this.props.parentPost, this.state.inputValue);
    }
  }

  render() {
    const { username, isSmall, isLoading } = this.props;
    const buttonClass = isLoading ? 'CommentForm__button_disabled' :
      'CommentForm__button_primary';

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
            disabled={isLoading}
          />
          <button
            onClick={this.handleSubmit}
            disabled={isLoading}
            className={`CommentForm__button ${buttonClass}`}
          >
            {isLoading && <Icon type="loading" />}
            {isLoading ? 'Commenting' : 'Comment'}
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
  isLoading: PropTypes.bool,
  inputValue: PropTypes.string.isRequired,
};

CommentForm.defaultProps = {
  username: undefined,
  isSmall: false,
  isLoading: false,
  inputValue: '',
};

export default CommentForm;
