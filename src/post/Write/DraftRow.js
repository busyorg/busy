import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteDraft } from './EditorActions';

@connect(null, { deleteDraft })
class DraftRow extends React.Component {
  render() {
    const { id, data } = this.props;
    let { title = '', body = '' } = data;
    title = title.trim();
    body = body.replace(/\r?\n|\r|[\u200B-\u200D\uFEFF]/g, ' ').substring(0, 50);
    let draftTitle = title.length ? title : body;
    draftTitle = draftTitle.trim();
    if (draftTitle.length === 0) {
      draftTitle = 'Untitled Draft';
    }
    return (
      <div>
        <Link to={{ pathname: '/write', search: `?draft=${id}` }}>
          <h3>{draftTitle}</h3>
        </Link>
        <div>
          <a onClick={() => { this.props.deleteDraft(id); }}>
            Delete this draft
          </a>
        </div>
      </div>
    );
  }
}

export default DraftRow;
