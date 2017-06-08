import React, { PropTypes } from 'react';
import InfiniteScroll from 'redux-infinite-scroll';
import Story from '../Story/Story';
import Loading from '../../widgets/Loading';
import './Feed.less';

const Feed = ({ posts, isLoading, hasMore, onLoadMore }) =>
  <div className="Feed">
    <InfiniteScroll
      loadingMore={isLoading}
      loader={<Loading />}
      hasMore={hasMore}
      loadMore={onLoadMore}
      elementIsScrollable={false}
    >
      {posts && posts.map((entry, i) => <Story key={i} post={entry} />)}
      {!hasMore && <div className="Feed__end">No more items</div>}
    </InfiniteScroll>
  </div>;

Feed.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape()),
  isLoading: PropTypes.bool,
  hasMore: PropTypes.bool,
  onLoadMore: PropTypes.func,
};

Feed.defaultProps = {
  posts: [],
  isLoading: false,
  hasMore: true,
  onLoadMore: () => {},
};

export default Feed;
