import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Form, Select, Checkbox } from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import Action from '../Button/Action';
import { rewardsValues } from '../../../common/constants/rewards';
import { validateTopics } from '../../helpers/postHelpers';
import './EditorFullScreenFooter.less';

const EditorFullScreenFooter = ({ isUpdating, getFieldDecorator, onUpdate, loading, intl }) => (
  <div className="EditorFullScreen__footer">
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
          { validator: validateTopics(intl) },
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
    <Form.Item className={classNames({ Editor__hidden: isUpdating })}>
      {getFieldDecorator('reward')(
        <Select
          onChange={onUpdate}
          disabled={isUpdating}
          className="EditorFullScreen__footer__reward-select"
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
    <Form.Item className={classNames('EditorFullScreen__upvote', { Editor__hidden: isUpdating })}>
      {getFieldDecorator('upvote', { valuePropName: 'checked', initialValue: true })(
        <Checkbox onChange={onUpdate} disabled={isUpdating}>
          <FormattedMessage id="like_post" defaultMessage="Like this post" />
        </Checkbox>,
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
);

EditorFullScreenFooter.propTypes = {
  intl: PropTypes.shape().isRequired,
  isUpdating: PropTypes.bool,
  getFieldDecorator: PropTypes.func,
  onUpdate: PropTypes.func,
  loading: PropTypes.bool,
};

EditorFullScreenFooter.defaultProps = {
  isUpdating: false,
  loading: false,
  getFieldDecorator: () => {},
  onUpdate: () => {},
};

export default injectIntl(EditorFullScreenFooter);
