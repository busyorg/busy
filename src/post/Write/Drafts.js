import { connect } from 'react-redux';
import { Link } from 'react-router';
import React from 'react';
import _ from 'lodash';

import Header from '../../app/Header';

const DraftRow = (props) => {
  const id = props.id;
  const { title = '', body = '' } = props.data;
  let draftTitle = title.trim() || body.substring(0, 50);
  draftTitle = draftTitle || 'Untitled Draft';
  return <Link to={{ pathname: '/write', query: { draft: id } }}><div>{draftTitle}</div></Link>;
};

const DraftList = ({ editor: { draftPosts } }) =>
  (
    <div className="main-panel">
      <Header />
      <div className="container my-3">
        Your Drafts
          {_.map(draftPosts, (draft, key) => <DraftRow key={key} data={draft.postData} id={key} />)}
      </div>
    </div>
  );

export default connect(state => ({ editor: state.editor }))(DraftList);
