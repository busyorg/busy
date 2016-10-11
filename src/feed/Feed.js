import React from 'react';
import ReduxInfiniteScroll from 'redux-infinite-scroll';
import Loading from './../widgets/Loading';
import AddPost from './../post/newPost/EmbeddedNewPost';
import PostFeedItem from '../post/PostFeedItem';

export default class Feed extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.loadContent();
  }

  render() {
    const { content, isFetching, hasMore, ItemComponent } = this.props;

    return (
      <div className="grid">
        <div className="grid-content">
          <AddPost />

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
                <ItemComponent key={key} entry={entry} replies={this.props.replies} />
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
