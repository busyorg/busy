import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Icon } from 'antd';
import withEditor from '../Editor/withEditor';
import EditorInput from '../Editor/EditorInput';
import Body, { remarkable } from '../Story/Body';
import './EmbeddedCommentForm.less';

@withEditor
class EmbeddedCommentForm extends React.Component {
  static propTypes = {
    parentPost: PropTypes.shape().isRequired,
    isLoading: PropTypes.bool,
    inputValue: PropTypes.string.isRequired,
    onImageUpload: PropTypes.func,
    onImageInvalid: PropTypes.func,
    onSubmit: PropTypes.func,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    isLoading: false,
    inputValue: '',
    onImageUpload: () => {},
    onImageInvalid: () => {},
    onSubmit: () => {},
    onClose: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      body: '',
      bodyHTML: '',
      isDisabledSubmit: false,
    };

    this.setInput = this.setInput.bind(this);
    this.setBodyAndRender = this.setBodyAndRender.bind(this);
    this.handleBodyUpdate = this.handleBodyUpdate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setBodyAndRender(this.props.inputValue);
    if (this.input) {
      this.input.focus();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isLoading) {
      this.setBodyAndRender(nextProps.inputValue);
    }
  }

  setInput(input) {
    this.input = input;
  }

  setBodyAndRender(body) {
    this.setState({
      body,
      bodyHTML: remarkable.render(body),
    });
  }

  handleBodyUpdate(body) {
    this.setBodyAndRender(body);
  }

  handleSubmit(e) {
    e.stopPropagation();
    this.setState({ isDisabledSubmit: true });
    if (this.state.body) {
      this.props.onSubmit(this.props.parentPost, this.state.body);
    }
  }

  render() {
    const { isLoading } = this.props;
    const { body, bodyHTML } = this.state;

    const buttonClass = isLoading
      ? 'EmbeddedCommentForm__button_disabled'
      : 'EmbeddedCommentForm__button_primary';

    return (
      <div className="EmbeddedCommentForm">
        <EditorInput
          autosize={{ minRows: 3, maxRows: 6 }}
          inputRef={this.setInput}
          value={body}
          onChange={this.handleBodyUpdate}
          onImageUpload={this.props.onImageUpload}
          onImageInvalid={this.props.onImageInvalid}
          inputId={`${this.props.parentPost.id}-embedded-comment-inputfile`}
        />
        <button
          onClick={this.handleSubmit}
          disabled={isLoading}
          className={`EmbeddedCommentForm__button ${buttonClass}`}
        >
          {isLoading && <Icon type="loading" />}
          {isLoading ? (
            <FormattedMessage id="comment_update_progress" defaultMessage="Updating" />
          ) : (
            <FormattedMessage id="comment_update_send" defaultMessage="Update comment" />
          )}
        </button>
        <a role="presentation" className="EmbeddedCommentForm__close" onClick={this.props.onClose}>
          <FormattedMessage id="close" defaultMessage="Close" />
        </a>
        {bodyHTML && (
          <div className="EmbeddedCommentForm__preview">
            <span className="Editor__label">
              <FormattedMessage id="preview" defaultMessage="Preview" />
            </span>
            <Body body={bodyHTML} />
          </div>
        )}
      </div>
    );
  }
}

export default EmbeddedCommentForm;
