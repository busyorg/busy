import React, { Component } from 'react';
import PostSingleContent from './PostSingleContent';
import PostSingleComments from './PostSingleComments';
import './PostSingleModal.scss';

export default class PostSingleModal extends Component {

  componentDidMount() {
    // manipulate address bar to show the article's address
    // eslint-disable-next-line
    if (window && window.history) {
      const { content } = this.props;
      this.pushUrlState(content);
    }
  }

  componentWillUnmount() {
    this.handleClose();
  }

  handleClose = () => {
    // fix the manipulated URL
    /* eslint-disable */
    if (window && window.history) {
      window.history.back();
      window.onpopstate = null;
    }
    /* eslint-enable */
  };

  scrollToTop = () => {
    if (this.DOMNode) {
      this.DOMNode.scrollTop = 0;
    }
  };

  pushUrlState = (content) => {
    window.history.pushState({}, content.title, content.url);
  };

  nextStory = () => {
    this.props.openPostModal(this.props.nextStory.id);
    this.pushUrlState(this.props.nextStory);
    this.scrollToTop();
  };

  render() {
    return (
      <div
        className="PostSingleModal"
        ref={(c) => { this.DOMNode = c; }}
      >

        <PostSingleContent
          content={this.props.content}
          bookmarks={this.props.bookmarks}
          toggleBookmark={this.props.toggleBookmark}
          reblog={this.props.reblog}
          isReblogged={this.props.isReblogged}
          canReblog={this.props.canReblog}
          openCommentingDraft={this.props.openCommentingDraft}
          likePost={this.props.likePost}
          unlikePost={this.props.unlikePost}
          dislikePost={this.props.dislikePost}
          isPostLiked={this.props.isPostLiked}
          isPostDisliked={this.props.isPostDisliked}
          onEdit={this.props.onEdit}
        />

        <PostSingleComments
          content={this.props.content}
          openCommentingDraft={this.props.openCommentingDraft}
        />
      </div>
    );
  }
}
