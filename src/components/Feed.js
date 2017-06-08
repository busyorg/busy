import React from 'react';
import InfiniteScroll from 'redux-infinite-scroll';
import Story from './Story/Story';
import Loading from '../widgets/Loading';
import './Feed.less';

class Feed extends React.Component {
  loadMore() {
    if (this.props.onLoadMore) {
      this.props.onLoadMore();
    }
  }

  render() {
    // TODO: Use post id for key prop on real data

    const { posts } = this.props;
    return (
      <div className="Feed">
        <InfiniteScroll loader={<Loading />} loadMore={() => this.loadMore()}>
          {posts && posts.map((post, i) => <Story key={i} post={post} />)}
        </InfiniteScroll>
      </div>);
  }
}

export default Feed;
