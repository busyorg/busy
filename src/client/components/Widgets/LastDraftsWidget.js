import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import ListWidget from './ListWidget';
import './LastDraftsWidget.less';

function Draft({ id, title, lastUpdated }) {
  return (
    <div>
      <Link to={{ pathname: '/editor', search: `?draft=${id}` }}>
        {title || <FormattedMessage id="draft_untitled" defaultMessage="Untitled draft" />}
      </Link>
      <div className="LastDraftsWidget__Draft__date">
        <FormattedRelative value={lastUpdated} />
      </div>
    </div>
  );
}

Draft.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  lastUpdated: PropTypes.string.isRequired,
};

Draft.defaultProps = {
  title: '',
};

function renderDraft(item) {
  return <Draft id={item.id} title={item.title} lastUpdated={item.lastUpdated} />;
}

function keyExtractor(item) {
  return item.id;
}

export default function LastDraftsWidget({ drafts }) {
  return (
    <ListWidget
      icon="icon-write"
      title="Last drafts"
      data={drafts}
      renderItem={renderDraft}
      keyExtractor={keyExtractor}
      footer={
        <Link to={'/drafts'}>
          <FormattedMessage id="show_more" defaultMessage="Show more" />
        </Link>
      }
    />
  );
}

LastDraftsWidget.propTypes = {
  drafts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string,
      lastUpdated: PropTypes.string.isRequired,
    }),
  ),
};

LastDraftsWidget.defaultProps = {
  drafts: [],
};
