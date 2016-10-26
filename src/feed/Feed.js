import React from 'react';
import ReduxInfiniteScroll from 'redux-infinite-scroll';
import Loading from '../widgets/Loading';
import AddPost from '../post/Write/EmbeddedNewPost';
import PostFeed from '../post/PostFeed';
import CommentForm from '../comments/CommentForm';

export default class Feed extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.loadContent();
  }

  componentDidUpdate() {
    if(!this.props.content.length && !this.props.isFetching) {
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
      bookmarks,
      notify
    } = this.props;

    return (
      <div className="grid">
        <div className="grid-content" onClick={() => this.handleFeedClick()}>

          <ReduxInfiniteScroll
            loadMore={this.props.loadMoreContent}
            loader={<Loading />}
            loadingMore={isFetching}
            hasMore={hasMore}
            elementIsScrollable={false}
            threshold={200}
          >

            {
              content.map((entry, key) =>
                <ItemComponent
                  key={key}
                  entry={entry}
                  replies={replies}
                  toggleBookmark={toggleBookmark}
                  bookmarks={bookmarks}
                  onCommentRequest={e => this.handleCommentRequest(e)}
                  notify={notify}
                />
              )
            }

          </ReduxInfiniteScroll>
        </div>

        <AddPost />
        <CommentForm />
      </div>
    );
  }
}
Feed.defaultProps = {
  ItemComponent: PostFeed
};
