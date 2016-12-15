import React, { Component } from 'react';
import { withRouter, Link } from 'react-router';
import PostSingleContent from './PostSingleContent';

import MenuPost from '../app/Menu/MenuPost';
import CommentForm from '../comments/CommentForm';

import './PostSingleModal.scss';

@withRouter
export default class PostSingleModal extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
    // manipulate address bar to show the article's address
    if (window && window.history) {
      const { content } = this.props;
      const postPath = `/${content.parent_permlink}/@${content.author}/${content.permlink}`;
      window.history.pushState({}, content.title, postPath);
    }

    if (window) {
      // freeze scroll in the feed
      window.document.querySelector('body').style.overflow = 'hidden';
      window.onpopstate = () => this.routerWillLeave();
    }
  }

  componentWillUnmount() {
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

  render() {
    const { content, sidebarIsVisible, reblog, isReblogged, openCommentingDraft } = this.props;

    return (
      <div className={ sidebarIsVisible ? 'PostSingleModal withSidebar' : 'PostSingleModal' }>
        <MenuPost
          reblog={reblog}
          isReblogged={isReblogged}
          openCommentingDraft={openCommentingDraft}
          likePost={this.props.likePost}
          unlikePost={this.props.unlikePost}
          dislikePost={this.props.dislikePost}
          isPostLiked={this.props.isPostLiked}
          isPostDisliked={this.props.isPostDisliked}
          content={content}
        />
        <header>
          <div className="top-nav">
            <a className="left" onClick={this.handleClose}>
              <i className="icon icon-md icon-menu material-icons">clear</i>
            </a>
            <div className="section-content top-head">
              <div className="logo"><Link to="/" onlyActiveOnIndex activeClassName="active"><img src="/img/logo.svg" /></Link></div>
            </div>
          </div>
          {this.props.children && <div className="app-nav">{this.props.children}</div>}
        </header>
        <PostSingleContent
          content={content}
          bookmarks={this.props.bookmarks}
          toggleBookmark={this.props.toggleBookmark}
        />

        <CommentForm />
      </div>
    );
  }
}
