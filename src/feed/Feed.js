import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReduxInfiniteScroll from 'redux-infinite-scroll';
// import Modal from '../widgets/modal/Modal';
// import Loading from '../widgets/Loading';
// import PostFeed from '../post/PostFeed';
// import CommentForm from '../comments/CommentForm';
import * as appActions from '../actions';
import * as commentsActions from '../comments/commentsActions';
import * as bookmarkActions from '../bookmarks/bookmarksActions';
import * as reblogActions from '../app/Reblog/reblogActions';
// import PostSingle from '../post/postSingle/PostSingle';
import Story from '../components/Story/Story';
import StoryLoading from '../components/Story/StoryLoading';
import './Feed.less';

@connect(
  state => ({
    app: state.app,
    bookmarks: state.bookmarks,
    reblogList: state.reblog
  }),
  dispatch =>
    bindActionCreators(
      {
        openCommentingDraft: commentsActions.openCommentingDraft,
        closeCommentingDraft: commentsActions.closeCommentingDraft,
        toggleBookmark: bookmarkActions.toggleBookmark,
        reblog: reblogActions.reblog,
        openPostModal: appActions.openPostModal,
        closePostModal: appActions.closePostModal
      },
      dispatch
    )
)
export default class Feed extends React.Component {
  componentWillMount() {
    if (!this.props.content.length) {
      this.props.loadContent();
    }
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

  handlePostModalClose = () => {
    this.props.closePostModal();
    /* eslint-disable */
    if (window && window.history) {
      window.history.back();
    }
    /* eslint-enable */
  };

  render() {
    const {
      content,
      isFetching,
      hasMore,
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
            loader={<StoryLoading />}
            loadingMore={isFetching}
            hasMore={hasMore}
            elementIsScrollable={false}
            threshold={200}
          >
            {content.map((post, key) => {
              if (this.props.username) {
                if (this.props.onlyReblogs && post.author === this.props.username) {
                  return false;
                }
                if (this.props.hideReblogs && post.author !== this.props.username) {
                  return false;
                }
              }

              return (
                <div style={{ margin: '1em 0' }}>
                  <Story
                    post={post}
                    onFollowClick={() => console.log('Follow click')}
                    onSaveClick={() => console.log('Save click')}
                    onReportClick={() => console.log('Report click')}
                    onLikeClick={() => console.log('Like click')}
                    onDislikeClick={() => console.log('Dislike click')}
                    onCommentClick={() => console.log('Comment click')}
                    onShareClick={() => console.log('Share click')}
                  />
                </div>
              );
            })}
          </ReduxInfiniteScroll>
        </div>

        {/* <CommentForm />
        {app.isPostModalOpen &&
          <Modal onClose={this.handlePostModalClose}>
            <PostSingle modal contentList={content} />
          </Modal>}*/}
      </div>
    );
  }
}
// Feed.defaultProps = {
//   ItemComponent: PostFeed
// };

//         <ItemComponent
//                     key={key}
//                     post={post}
//                     replies={replies}
//                     toggleBookmark={toggleBookmark}
//                     app={app}
//                     bookmarks={bookmarks}
//                     onCommentRequest={e => this.handleCommentRequest(e)}
//                     notify={notify}
//                     reblog={reblog}
//                     isReblogged={reblogList.includes(post.id)}
//                     openPostModal={this.props.openPostModal}
//                   />
