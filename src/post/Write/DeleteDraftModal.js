import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal } from 'antd';
import 'url-search-params-polyfill';
import { injectIntl } from 'react-intl';
import { deleteDraft } from './editorActions';
import { notify } from '../../app/Notification/notificationActions';
import Loading from '../../components/Icon/Loading';

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
    this.setState({ loading: true });
    this.props.deleteDraft(this.props.draftId).then(() => {
      this.props.notify('Draft have been deleted', 'success');
      this.props.onDelete();
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
        confirmLoading={this.state.shareModalLoading}
        okText={intl.formatMessage({ id: 'confirm', defaultMessage: 'Confirm' })}
        cancelText={intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
        onOk={() => {
          this.deleteDraft();
        }}
        onCancel={() => {
          this.props.onCancel();
        }}
      >
        {this.state.loading ? <Loading /> : 'Deleted Drafts are gone forever. Are you Sure?'}
      </Modal>
    );
  }
}

export default DeleteDraftModal;
