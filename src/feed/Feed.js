import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReduxInfiniteScroll from 'redux-infinite-scroll';

import Loading from '../widgets/Loading';
import PostFeed from '../post/PostFeed';
import CommentForm from '../comments/CommentForm';
import * as appActions from '../actions';
import * as commentsActions from '../comments/commentsActions';
import * as bookmarkActions from '../bookmarks/bookmarksActions';
import * as reblogActions from '../app/Reblog/reblogActions';

import './Feed.scss';

@connect(
  state => ({
    app: state.app,
    bookmarks: state.bookmarks,
    reblogList: state.reblog,
  }),
  dispatch => bindActionCreators({
    openCommentingDraft: commentsActions.openCommentingDraft,
    closeCommentingDraft: commentsActions.closeCommentingDraft,
    toggleBookmark: bookmarkActions.toggleBookmark,
    reblog: reblogActions.reblog,
  }, dispatch)
)
export default class Feed extends React.Component {
  componentDidMount() {
    this.props.loadContent();
  }

  componentDidUpdate() {
    if (!this.props.content.length && !this.props.isFetching) {
      this.props.loadContent();
    }
  }

  handleCommentRequest(draftProps) {
    this.props.openCommentingDraft(draftProps);
  }

  handleFeedClick() {
    this.props.closeCommentingDraft();
  }

  render() {
    const {
      content,
      isFetching,
      hasMore,
      ItemComponent,
      replies,
      toggleBookmark,
      app,
      bookmarks,
      notify,
      reblog,
      reblogList
    } = this.props;

    return (
      <div className="Feed">
        <div className="Feed__content" onClick={() => this.handleFeedClick()}>
          <ReduxInfiniteScroll
            loadMore={this.props.loadMoreContent}
            loader={<Loading />}
            loadingMore={isFetching}
            hasMore={hasMore}
            elementIsScrollable={false}
            threshold={200}
          >
            {
              content.map((post, key) => {
                if (this.props.username && post.author !== this.props.username) {
                  return false;
                }

                return (
                  <ItemComponent
                    key={key}
                    post={post}
                    replies={replies}
                    toggleBookmark={toggleBookmark}
                    app={app}
                    bookmarks={bookmarks}
                    onCommentRequest={e => this.handleCommentRequest(e)}
                    notify={notify}
                    reblog={reblog}
                    isReblogged={reblogList.includes(post.id)}
                  />
                );
              })
            }
          </ReduxInfiniteScroll>
        </div>

        <CommentForm />
      </div>
    );
  }
}
Feed.defaultProps = {
  ItemComponent: PostFeed
};
