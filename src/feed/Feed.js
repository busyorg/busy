import React from 'react';
import ReduxInfiniteScroll from 'redux-infinite-scroll';

import Loading from './../widgets/Loading';
import PostFeedItem from '../post/PostFeedItem';

export default class Feed extends React.Component {
  constructor(props) {
    super(props);
    this._customListener = [];
  }

  componentDidMount() {
    this.props.loadContent();
  }

  render() {
    const { content, isFetching, hasMore, ItemComponent, replies, toggleBookmark, bookmarks } = this.props;

    return (
      <div className="grid">
        <div className="grid-content">
          <ReduxInfiniteScroll
            loadMore={this.props.loadMoreContent}
            loader={<Loading />}
            loadingMore={isFetching}
            hasMore={hasMore}
            elementIsScrollable={false}
            threshold={200}
          >
            {content && content.map((entry, key) =>
              <ItemComponent
                key={key}
                entry={entry}
                replies={replies}
                toggleBookmark={toggleBookmark}
                bookmarks={bookmarks}
              />
            )}
          </ReduxInfiniteScroll>
        </div>
      </div>
    );
  }
}
Feed.defaultProps = {
  ItemComponent: PostFeedItem
};
