import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';
import { injectIntl, FormattedMessage } from 'react-intl';
import readingTime from 'reading-time';
import { Checkbox, Form, Input, Select } from 'antd';
import { rewardsValues } from '../../../common/constants/rewards';
import EditorInput from './EditorInput';
import Body from '../Story/Body';
import { validateTopics } from '../../helpers/postHelpers';
import withEditor from './withEditor';
import EditorFullScreenHeader from './EditorFullScreenHeader';
import Action from '../Button/Action';
import './EditorFullScreen.less';

@injectIntl
@Form.create()
@withEditor
class EditorFullScreen extends React.Component {
  static propTypes = {
    bodyHTML: PropTypes.string,
    intl: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
    loading: PropTypes.bool.isRequired,
    isUpdating: PropTypes.bool.isRequired,
    saving: PropTypes.bool.isRequired,
    onImageInvalid: PropTypes.func.isRequired,
    onImageUpload: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleEditorUpdates: PropTypes.func.isRequired,
    title: PropTypes.string,
    topics: PropTypes.arrayOf(PropTypes.string),
    body: PropTypes.string,
    reward: PropTypes.string,
    upvote: PropTypes.bool,
  };

  static defaultProps = {
    draftId: 0,
    bodyHTML: '',
    title: '',
    topics: [],
    body: '',
    reward: '',
    upvote: false,
  };

  constructor(props) {
    super(props);

    this.onUpdate = this.onUpdate.bind(this);
    this.throttledUpdate = this.throttledUpdate.bind(this);
  }

  componentDidMount() {
    this.props.form.setFieldsValue({
      title: this.props.title,
      topics: this.props.topics,
      body: this.props.body,
      reward: this.props.reward,
      upvote: this.props.upvote,
    });
  }

  onUpdate() {
    _.throttle(this.throttledUpdate, 200, { leading: false, trailing: true })();
  }

  throttledUpdate() {
    const { form } = this.props;
    this.props.handleEditorUpdates(form.getFieldsValue());
  }

  handleValidateTopics = intl => (rule, value, callback) =>
    validateTopics(rule, value, callback, intl);

  render() {
    const { bodyHTML, intl, form, loading, isUpdating, saving, handleSubmit } = this.props;
    const { getFieldDecorator } = form;
    const { words, minutes } = readingTime(bodyHTML);

    return (
      <div className="EditorFullScreen__container">
        <EditorFullScreenHeader
          saving={saving}
          loading={loading}
          isUpdating={isUpdating}
          handleSubmit={handleSubmit}
          words={words}
          minutes={minutes}
        />
        {getFieldDecorator('title', {
          initialValue: '',
        })(
          <Input
            onChange={this.onUpdate}
            className="EditorFullScreen__title-input"
            placeholder={intl.formatMessage({
              id: 'title_placeholder',
              defaultMessage: 'Add title',
            })}
          />,
        )}
        <div className="EditorFullScreen__contents">
          <div className="EditorFullScreen__column">
            <Form className="EditorFullScreen__form" layout="vertical" onSubmit={handleSubmit}>
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
                    onChange={this.onUpdate}
                    onImageUpload={this.props.onImageUpload}
                    onImageInvalid={this.props.onImageInvalid}
                    inputId={'fullscreen-editor-inputfile'}
                  />,
                )}
              </Form.Item>
            </Form>
          </div>
          <div className="EditorFullScreen__column EditorFullScreen__preview">
            <Body full body={bodyHTML} />
            {_.isEmpty(bodyHTML) && (
              <div className="EditorFullScreen__preview__empty">
                <FormattedMessage id="preview_of_your_post" defaultMessage="Preview of your post" />
              </div>
            )}
          </div>
        </div>
        <div className="EditorFullScreen__footer">
          <div className="EditorFullScreen__footer__left">
            <Form.Item>
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
                  onChange={this.onUpdate}
                  className="EditorFullScreen__topics"
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
          </div>
          <div className="EditorFullScreen__footer__right">
            <Form.Item
              className={classNames('EditorFullScreen__upvote', { Editor__hidden: isUpdating })}
            >
              {getFieldDecorator('upvote', { valuePropName: 'checked', initialValue: true })(
                <Checkbox onChange={this.onUpdate} disabled={isUpdating}>
                  <FormattedMessage id="like_post" defaultMessage="Like this post" />
                </Checkbox>,
              )}
            </Form.Item>
            <Form.Item className={classNames({ Editor__hidden: isUpdating })}>
              {getFieldDecorator('reward')(
                <Select
                  onChange={this.onUpdate}
                  disabled={isUpdating}
                  className="EditorFullScreen__reward-select"
                >
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
          </div>
        </div>
      </div>
    );
  }
}

export default EditorFullScreen;
