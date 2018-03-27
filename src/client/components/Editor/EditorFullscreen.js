import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl, FormattedMessage } from 'react-intl';
import readingTime from 'reading-time';
import { Checkbox, Form, Input, Select, Modal } from 'antd';
import { rewardsValues } from '../../../common/constants/rewards';
import Action from '../Button/Action';
import EditorInput from './EditorInput';
import Body from '../Story/Body';
import { validateTopics } from '../../helpers/postHelpers';
import withEditor from './withEditor';
import './EditorFullscreen.less';

@injectIntl
@withEditor
class EditorFullScreen extends React.Component {
  static propTypes = {
    displayFullscreenEditor: PropTypes.bool.isRequired,
    handleHideFullscreenEditor: PropTypes.func.isRequired,
    bodyHTML: PropTypes.string,
    intl: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
    loading: PropTypes.bool.isRequired,
    isUpdating: PropTypes.bool.isRequired,
    saving: PropTypes.bool.isRequired,
    onImageInvalid: PropTypes.func.isRequired,
    onImageUpload: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
  };

  static defaultProps = {
    draftId: 0,
    bodyHTML: '',
  };

  handleValidateTopics = intl => (rule, value, callback) =>
    validateTopics(rule, value, callback, intl);

  render() {
    const {
      displayFullscreenEditor,
      handleHideFullscreenEditor,
      bodyHTML,
      intl,
      form,
      loading,
      isUpdating,
      saving,
    } = this.props;
    const { getFieldDecorator } = form;
    const { words, minutes } = readingTime(bodyHTML);

    return (
      <Modal
        title={null}
        footer={null}
        visible={displayFullscreenEditor}
        onCancel={handleHideFullscreenEditor}
        wrapClassName="EditorFullscreen"
        destroyOnClose
        width="100%"
        style={{ top: 0 }}
        bodyStyle={{ height: '100vh', padding: 0 }}
      >
        <div className="EditorFullscreen__container">
          <div className="EditorFullscreen__header">
            <div className="Editor__bottom">
              <span className="Editor__bottom__info">
                <i className="iconfont icon-markdown" />{' '}
                <FormattedMessage
                  id="markdown_supported"
                  defaultMessage="Styling with markdown supported"
                />
              </span>
              <div className="Editor__bottom__right">
                {saving && (
                  <span className="Editor__bottom__right__saving">
                    <FormattedMessage id="saving" defaultMessage="Saving..." />
                  </span>
                )}
              </div>
            </div>
          </div>
          <Form.Item className="Editor__bottom__submit">
            {isUpdating ? (
              <Action
                primary
                loading={loading}
                disabled={loading}
                text={intl.formatMessage({
                  id: loading ? 'post_send_progress' : 'post_update_send',
                  defaultMessage: loading ? 'Submitting' : 'Update post',
                })}
              />
            ) : (
              <Action
                primary
                loading={loading}
                disabled={loading}
                text={intl.formatMessage({
                  id: loading ? 'post_send_progress' : 'post_send',
                  defaultMessage: loading ? 'Submitting' : 'Post',
                })}
              />
            )}
          </Form.Item>
          <div className="EditorFullscreen__column EditorFullscreen__form">
            <Form className="Editor" layout="vertical" onSubmit={this.handleSubmit}>
              <Form.Item
                label={
                  <span className="Editor__label">
                    <FormattedMessage id="title" defaultMessage="Title" />
                  </span>
                }
              >
                {getFieldDecorator('title', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'title_error_empty',
                        defaultMessage: 'title_error_empty',
                      }),
                    },
                    {
                      max: 255,
                      message: intl.formatMessage({
                        id: 'title_error_too_long',
                        defaultMessage: "Title can't be longer than 255 characters.",
                      }),
                    },
                  ],
                })(
                  <Input
                    onChange={this.props.onUpdate}
                    className="Editor__title"
                    placeholder={intl.formatMessage({
                      id: 'title_placeholder',
                      defaultMessage: 'Add title',
                    })}
                  />,
                )}
              </Form.Item>
              <Form.Item
                label={
                  <span className="Editor__label">
                    <FormattedMessage id="topics" defaultMessage="Topics" />
                  </span>
                }
                extra={intl.formatMessage({
                  id: 'topics_extra',
                  defaultMessage:
                    'Separate topics with commas. Only lowercase letters, numbers and hyphen character is permitted.',
                })}
              >
                {getFieldDecorator('topics', {
                  initialValue: [],
                  rules: [
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'topics_error_empty',
                        defaultMessage: 'Please enter topics',
                      }),
                      type: 'array',
                    },
                    { validator: this.handleValidateTopics(this.props.intl) },
                  ],
                })(
                  <Select
                    onChange={this.props.onUpdate}
                    className="Editor__topics"
                    mode="tags"
                    placeholder={intl.formatMessage({
                      id: 'topics_placeholder',
                      defaultMessage: 'Add story topics here',
                    })}
                    dropdownStyle={{ display: 'none' }}
                    tokenSeparators={[' ', ',']}
                  />,
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('body', {
                  rules: [
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'story_error_empty',
                        defaultMessage: "Story content can't be empty.",
                      }),
                    },
                  ],
                })(
                  <EditorInput
                    autosize={{ minRows: 6, maxRows: 12 }}
                    addon={
                      <FormattedMessage
                        id="reading_time"
                        defaultMessage={'{words} words / {min} min read'}
                        values={{
                          words,
                          min: Math.ceil(minutes),
                        }}
                      />
                    }
                    onChange={this.props.onUpdate}
                    onImageUpload={this.props.onImageUpload}
                    onImageInvalid={this.props.onImageInvalid}
                    inputId={'fullscreen-editor-inputfile'}
                  />,
                )}
              </Form.Item>
              <Form.Item
                className={classNames({ Editor__hidden: isUpdating })}
                label={
                  <span className="Editor__label">
                    <FormattedMessage id="reward" defaultMessage="Reward" />
                  </span>
                }
              >
                {getFieldDecorator('reward')(
                  <Select onChange={this.props.onUpdate} disabled={isUpdating}>
                    <Select.Option value={rewardsValues.all}>
                      <FormattedMessage id="reward_option_100" defaultMessage="100% Steem Power" />
                    </Select.Option>
                    <Select.Option value={rewardsValues.half}>
                      <FormattedMessage id="reward_option_50" defaultMessage="50% SBD and 50% SP" />
                    </Select.Option>
                    <Select.Option value={rewardsValues.none}>
                      <FormattedMessage id="reward_option_0" defaultMessage="Declined" />
                    </Select.Option>
                  </Select>,
                )}
              </Form.Item>
              <Form.Item className={classNames({ Editor__hidden: isUpdating })}>
                {getFieldDecorator('upvote', { valuePropName: 'checked', initialValue: true })(
                  <Checkbox onChange={this.props.onUpdate} disabled={isUpdating}>
                    <FormattedMessage id="like_post" defaultMessage="Like this post" />
                  </Checkbox>,
                )}
              </Form.Item>
            </Form>
          </div>
          <div className="EditorFullscreen__column EditorFullscreen__preview">
            {bodyHTML && (
              <Form.Item
                label={
                  <span className="Editor__label">
                    <FormattedMessage id="preview" defaultMessage="Preview" />
                  </span>
                }
              >
                <Body full body={bodyHTML} />
              </Form.Item>
            )}
          </div>
        </div>
      </Modal>
    );
  }
}

export default EditorFullScreen;
