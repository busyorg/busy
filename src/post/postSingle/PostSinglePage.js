import React from 'react';
import PostSingleContent from './PostSingleContent';
import PostSingleComments from './PostSingleComments';

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
