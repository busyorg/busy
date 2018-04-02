import _ from 'lodash';
import { connect } from 'react-redux';
import { getDraftPosts, getIsLoaded } from '../../reducers';
import LastDrafts from '../../components/Sidebar/LastDrafts';

const mapStateToProps = state => {
  const drafts = _.map(getDraftPosts(state), (draft, id) => ({
    id,
    ...draft,
  }));

  const sortedDrafts = _.orderBy(drafts, draft => new Date(draft.lastUpdated), ['desc']);

  return {
    loaded: getIsLoaded(state),
    drafts: sortedDrafts.slice(0, 4),
  };
};

export default connect(mapStateToProps)(LastDrafts);
