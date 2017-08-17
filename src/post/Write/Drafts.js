import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { getDraftPosts } from '../../reducers';

import DraftRow from './DraftRow';

@connect(state => ({
  draftPosts: getDraftPosts(state),
}))
class Drafts extends React.Component {
  static propTypes = {
    draftPosts: PropTypes.shape().isRequired,
  };

  render() {
    const { draftPosts } = this.props;

    return (
      <div className="shifted">
        <div className="container">
          <h1>Drafts</h1>
          {_.size(draftPosts) === 0 &&
            <h3 className="text-center">
              You don{"'"}t have any draft saved.
            </h3>}
          {_.map(draftPosts, (draft, key) => <DraftRow key={key} data={draft.postData} id={key} />)}
        </div>
      </div>
    );
  }
}

export default Drafts;
