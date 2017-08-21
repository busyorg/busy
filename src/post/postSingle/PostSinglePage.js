import React from 'react';
import { connect } from 'react-redux';
import PostSingleContent from './PostSingleContent';
import PostSingleComments from './PostSingleComments';
import { updateVotePowerBar } from '../../user/userActions';

@connect(({ user }) => ({ user }), { updateVotePowerBar })
export default class PostSinglePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="main-panel">
        <PostSingleContent {...this.props} />

        <PostSingleComments
          content={this.props.content}
          openCommentingDraft={this.props.openCommentingDraft}
        />
      </div>
    );
  }
}
