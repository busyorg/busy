import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteDraft } from './editorActions';

@connect(null, { deleteDraft })
class DraftRow extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    data: PropTypes.shape().isRequired,
    pending: PropTypes.bool,
    deleteDraft: PropTypes.func,
  };

  static defaultProps = {
    pending: false,
    deleteDraft: () => {},
  };

  handleDeleteClick = () => this.props.deleteDraft(this.props.id);

  render() {
    const { id, data, pending } = this.props;
    let { title = '', body = '' } = data;
    title = title.trim();
    body = body.replace(/\r?\n|\r|[\u200B-\u200D\uFEFF]/g, ' ').substring(0, 50);
    let draftTitle = title.length ? title : body;
    draftTitle = draftTitle.trim();

    return (
      <div>
        <Link to={{ pathname: '/write', search: `?draft=${id}` }}>
          <h3>
            {draftTitle.length === 0 ? <FormattedMessage id="draft_untitled" defaultMessage="Untitled draft" /> : draftTitle}
          </h3>
        </Link>
        <div>
          <Button loading={pending} type="danger" onClick={this.handleDeleteClick}>
            <FormattedMessage id="draft_delete" defaultMessage="Delete this draft" />
          </Button>
        </div>
      </div>
    );
  }
}

export default DraftRow;
