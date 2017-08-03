import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteDraft } from './editorActions';

@connect(null, { deleteDraft })
class DraftRow extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    data: PropTypes.shape().isRequired,
    deleteDraft: PropTypes.func,
  };

  static defaultProps = {
    deleteDraft: () => {},
  };

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
          <h3>
            {draftTitle}
          </h3>
        </Link>
        <div>
          <a
            role="presentation"
            onClick={() => {
              this.props.deleteDraft(id);
            }}
          >
            Delete this draft
          </a>
        </div>
      </div>
    );
  }
}

export default DraftRow;
