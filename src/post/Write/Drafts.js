import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import _ from 'lodash';
import Loading from '../../components/Icon/Loading';
import { reload } from '../../auth/authActions';
import { getDraftPosts, getPendingDrafts, getIsReloading } from '../../reducers';

import DraftRow from './DraftRow';

@connect(state => ({
  reloading: getIsReloading(state),
  draftPosts: getDraftPosts(state),
  pendingDrafts: getPendingDrafts(state),
}), { reload })
class Drafts extends React.Component {
  static propTypes = {
    reloading: PropTypes.bool,
    draftPosts: PropTypes.shape().isRequired,
    pendingDrafts: PropTypes.arrayOf(PropTypes.string),
    reload: PropTypes.func,
  };

  static defaultProps = {
    reloading: false,
    pendingDrafts: [],
    reload: () => {},
  };

  componentDidMount() {
    this.props.reload();
  }

  render() {
    const { reloading, draftPosts, pendingDrafts } = this.props;

    return (
      <div className="shifted">
        <div className="container">
          <h1><FormattedMessage id="drafts" defaultMessage="Drafts" /></h1>
          {reloading && <Loading />}
          {!reloading && _.size(draftPosts) === 0 &&
            <h3 className="text-center">
              <FormattedMessage id="drafts_empty" defaultMessage="You don't have any draft saved" />
            </h3>}
          {!reloading && _.map(draftPosts, (draft, key) =>
            <DraftRow key={key} data={draft} id={key} pending={pendingDrafts.includes(key)} />)
          }
        </div>
      </div>
    );
  }
}

export default Drafts;
