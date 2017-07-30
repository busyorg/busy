import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import DraftRow from './DraftRow';

@connect(state => ({
  editor: state.editor,
}))
class Drafts extends React.Component {
  render() {
    const { editor: { draftPosts } } = this.props;

    return (
      <div className="shifted">
        <div className="container">
          <h1>Drafts</h1>
          { _.size(draftPosts) === 0 &&
            <h3 className="text-center">
              You don{'\''}t have any draft saved.
            </h3>
          }
          { _.map(draftPosts, (draft, key) =>
            <DraftRow key={key} data={draft.postData} id={key} />)
          }
        </div>
      </div>
    );
  }
}

export default Drafts;
