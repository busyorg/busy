import React from 'react';
import ReduxInfiniteScroll from 'redux-infinite-scroll';
import Loading from './../widgets/Loading';
import AddPost from './../post/newPost/EmbeddedNewPost';
import PostFeedItem from '../post/PostFeedItem';
import CommentForm from './../comments/CommentForm';

export default class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeComment: null
    };
  }

  componentDidMount() {
    this.props.loadContent();
  }

  handleCommentRequest(postId) {
    this.setState({ activeComment: postId });
  };

  render() {
    const { content, isFetching, hasMore, ItemComponent } = this.props;
    const { activeComment } = this.state;

    return (
      <div className="grid">
        <div className="grid-content">
          <AddPost />
          <CommentForm
            open={activeComment !== null}
            parentId={activeComment}
          />

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
                  replies={this.props.replies}
                  onCommentRequest={e => this.handleCommentRequest(e)}
                />
              )
            }
          </ReduxInfiniteScroll>
        </div>
      </div>
    );
  }
}
Feed.defaultProps = {
  ItemComponent: PostFeedItem
};
