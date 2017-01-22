import React, { Component } from 'react';
import { withRouter, Link } from 'react-router';
import PostSingleContent from './PostSingleContent';
import CommentForm from '../comments/CommentForm';
import Icon from '../widgets/Icon';

import './PostSingleModal.scss';

@withRouter
export default class PostSingleModal extends Component {

  componentDidMount() {
    this.unlisten = this.props.router.listen(this.routerWillLeave);
    // manipulate address bar to show the article's address
    if (window && window.history) {
      const { content } = this.props;
      this.pushUrlState(content);
    }

    if (window) {
      // freeze scroll in the feed
      window.document.querySelector('body').style.overflow = 'hidden';
      window.onpopstate = () => this.routerWillLeave();
    }
  }

  componentWillUnmount() {
    this.unlisten();

    if (window) {
      window.onpopstate = null;
    }
  }

  routerWillLeave = () => {
    this.props.closePostModal();
    // un-freeze scroll in the feed
    if (window) {
      window.document.querySelector('body').style.overflow = 'initial';
    }
    return true;
  };

  handleClose = (e) => {
    this.routerWillLeave();
    // fix the manipulated URL
    if (window && window.history) {
      window.history.back();
    }
  };

  scrollToTop = () => {
    if (this.DOMNode) {
      this.DOMNode.scrollTop = 0;
    }
  };

  pushUrlState = (content) => {
    const postPath = `/${content.parent_permlink}/@${content.author}/${content.permlink}`;
    window.history.pushState({}, content.title, postPath);
  }

  render() {
    return (
      <div
        className={
          this.props.sidebarIsVisible
            ? 'PostSingleModal withSidebar'
            : 'PostSingleModal'
        }
        ref={(c) => { this.DOMNode = c; }}
      >
        <header>
          <div className="top-nav">
            <a className="left ml-1" onClick={this.handleClose}>
              <Icon name="clear" className="Icon--menu" />
            </a>
            <div className="section-content top-head">
              <div className="logo">
                <Link to="/" onlyActiveOnIndex activeClassName="active">
                  <img src="/img/logo.svg" />
                </Link>
              </div>
            </div>
          </div>
          {this.props.children && <div className="app-nav">{this.props.children}</div>}
        </header>
        <PostSingleContent
          content={this.props.content}
          bookmarks={this.props.bookmarks}
          toggleBookmark={this.props.toggleBookmark}
          reblog={this.props.reblog}
          isReblogged={this.props.isReblogged}
          openCommentingDraft={this.props.openCommentingDraft}
          likePost={this.props.likePost}
          unlikePost={this.props.unlikePost}
          dislikePost={this.props.dislikePost}
          isPostLiked={this.props.isPostLiked}
          isPostDisliked={this.props.isPostDisliked}
          openPostModal={this.props.openPostModal}
          nextStory={this.props.nextStory}
          scrollToTop={this.scrollToTop}
          pushUrlState={this.pushUrlState}
        />
        <CommentForm />
      </div>
    );
  }
}
