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
    return (<h3>
      <Link to={{ pathname: '/write', search: `?draft=${id}` }}>{draftTitle}</Link>
      <a onClick={() => { this.props.deleteDraft(id); }}>DELETE</a>
    </h3>);
  }
}

export default DraftRow;
