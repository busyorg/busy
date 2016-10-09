let React = require('react'),
  Loading = require('./../widgets/Loading'),
  AddPost = require('./../post/newPost/EmbeddedNewPost'),
  PostFeedItem = require('../post/PostFeedItem');

import ReduxInfiniteScroll from 'redux-infinite-scroll';

export default class Feed extends React.Component {
  constructor(props) {
    super(props);
    this._customListener = [];
  }

  componentDidMount() {
    this.props.loadContent();
  }

  render() {
    const { content, isFetching, hasMore } = this.props;

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
                <PostFeedItem key={key} entry={entry} replies={this.props.replies} />
              )
            }
          </ReduxInfiniteScroll>
        </div>
      </div>
    );
  }
}
