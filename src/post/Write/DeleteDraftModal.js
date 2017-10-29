import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal } from 'antd';
import 'url-search-params-polyfill';
import { injectIntl, FormattedMessage } from 'react-intl';
import { deleteDraft } from './editorActions';
import { notify } from '../../app/Notification/notificationActions';

@injectIntl
@connect(null, {
  notify,
  deleteDraft,
})
class DeleteDraftModal extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    deleteDraft: PropTypes.func,
    notify: PropTypes.func,
    draftId: PropTypes.string,
    onDelete: PropTypes.func,
    onCancel: PropTypes.func,
  };

  static defaultProps = {
    deleteDraft: () => {},
    notify: () => {},
    onDelete: () => {},
    onCancel: () => {},
    draftId: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  deleteDraft() {
    const { intl, draftId, onDelete } = this.props;
    this.setState({ loading: true });
    this.props.deleteDraft(draftId).then(() => {
      this.props.notify(
        intl.formatMessage({
          id: 'draft_delete_success',
          defaultMessage: 'Draft have been deleted',
        }),
        'success',
      );
      onDelete();
    });
  }

  render() {
    const { intl } = this.props;

    return (
      <Modal
        title={intl.formatMessage({
          id: 'draft_delete',
          defaultMessage: 'Delete this draft?',
        })}
        visible
        confirmLoading={this.state.loading}
        okText={intl.formatMessage({ id: 'confirm', defaultMessage: 'Confirm' })}
        cancelText={intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
        onOk={() => {
          this.deleteDraft();
        }}
        onCancel={() => {
          this.props.onCancel();
        }}
      >
        <FormattedMessage
          id="draft_delete_modal_content"
          defaultMessage="Are you sure you want to delete this draft permanently?"
        />
      </Modal>
    );
  }
}

export default DeleteDraftModal;
