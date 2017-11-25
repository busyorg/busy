import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import DeleteDraftModal from './DeleteDraftModal';

class DraftRow extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    data: PropTypes.shape().isRequired,
  };

  state = {
    showModalDelete: false,
  };

  showModal = () => this.setState({ showModalDelete: true });

  hideModal = () => this.setState({ showModalDelete: false });

  render() {
    const { id, data } = this.props;
    let { title = '', body = '' } = data;
    title = title.trim();
    body = body.replace(/\r?\n|\r|[\u200B-\u200D\uFEFF]/g, ' ').substring(0, 50);
    let draftTitle = title.length ? title : body;
    draftTitle = draftTitle.trim();

    return (
      <div>
        <Link to={{ pathname: '/editor', search: `?draft=${id}` }}>
          <h3>
            {draftTitle.length === 0 ? (
              <FormattedMessage id="draft_untitled" defaultMessage="Untitled draft" />
            ) : (
              draftTitle
            )}
          </h3>
        </Link>
        <Button type="danger" onClick={this.showModal}>
          <FormattedMessage id="draft_delete" defaultMessage="Delete this draft" />
        </Button>
        {this.state.showModalDelete && (
          <DeleteDraftModal draftId={this.props.id} onCancel={this.hideModal} />
        )}
      </div>
    );
  }
}

export default DraftRow;
