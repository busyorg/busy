import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { draftType, draftArrayType } from '../../types/drafts';
import Loading from '../../components/Icon/Loading';
import './LastDrafts.less';
import './SidebarContentBlock.less';

const Draft = ({ draft }) => (
  <div className="LastDrafts__draft">
    <Link to={{ pathname: '/editor', search: `?draft=${draft.id}` }}>
      {draft.title ? (
        draft.title
      ) : (
        <FormattedMessage id="draft_untitled" defaultMessage="Untitled draft" />
      )}
    </Link>
    <div className="LastDrafts__draft__date">
      <FormattedRelative value={new Date(draft.lastUpdated)} />
    </div>
  </div>
);
Draft.propTypes = {
  draft: draftType.isRequired,
};

const LastDrafts = ({ drafts, loaded }) => {
  if (!loaded) {
    return <Loading />;
  }

  const empty = drafts.length === 0;

  return (
    <div className="LastDrafts SidebarContentBlock">
      <h4 className="SidebarContentBlock__title">
        <i className="iconfont icon-write SidebarContentBlock__icon" />{' '}
        <FormattedMessage id="last_drafts" defaultMessage="Last drafts" />
      </h4>
      <div className="SidebarContentBlock__content">
        {empty && (
          <FormattedMessage id="drafts_empty" defaultMessage="You don't have any draft saved" />
        )}
        {drafts.map(draft => <Draft key={draft.id} draft={draft} />)}
        {!empty && (
          <h4 className="LastDrafts__more">
            <Link to={'/drafts'}>
              <FormattedMessage id="show_more" defaultMessage="Show more" />
            </Link>
          </h4>
        )}
      </div>
    </div>
  );
};

LastDrafts.propTypes = {
  drafts: draftArrayType,
  loaded: PropTypes.bool,
};

LastDrafts.defaultProps = {
  drafts: [],
  loaded: false,
};

export default LastDrafts;
