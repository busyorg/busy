import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal } from 'antd';
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
    draftIds: PropTypes.arrayOf(PropTypes.string),
    deleteDraft: PropTypes.func,
    notify: PropTypes.func,
    onDelete: PropTypes.func,
    onCancel: PropTypes.func,
  };

  static defaultProps = {
    draftIds: [],
    deleteDraft: () => {},
    notify: () => {},
    onDelete: () => {},
    onCancel: () => {},
  };

  state = {
    loading: false,
  };

  deleteDraft = () => {
    const { intl, draftIds, onDelete } = this.props;
    this.setState({ loading: true });
    this.props.deleteDraft(draftIds).then(() => {
      this.props.notify(
        intl.formatMessage({
          id: 'draft_delete_success',
          defaultMessage: 'Draft has been deleted',
        }),
        'success',
      );
      this.setState({
        loading: false,
      });
      onDelete();
    });
  };

  render() {
    const { intl, onCancel } = this.props;

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
        onOk={this.deleteDraft}
        onCancel={onCancel}
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
