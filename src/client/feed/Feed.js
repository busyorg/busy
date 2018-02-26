import React from 'react';
import PropTypes from 'prop-types';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import StoryContainer from './StoryContainer';
import StoryLoading from '../components/Story/StoryLoading';
import './Feed.less';

const Feed = ({ content, isFetching, hasMore, loadMoreContent, showPostModal }) => (
  <ReduxInfiniteScroll
    className="Feed"
    loadMore={loadMoreContent}
    loader={<StoryLoading />}
    loadingMore={isFetching}
    hasMore={hasMore}
    elementIsScrollable={false}
    threshold={1500}
  >
    {content.map(id => <StoryContainer key={id} id={id} showPostModal={showPostModal} />)}
  </ReduxInfiniteScroll>
);

Feed.propTypes = {
  showPostModal: PropTypes.func,
  content: PropTypes.arrayOf(PropTypes.number),
  isFetching: PropTypes.bool,
  hasMore: PropTypes.bool,
  loadMoreContent: PropTypes.func,
};

Feed.defaultProps = {
  content: [],
  isFetching: false,
  hasMore: false,
  loadMoreContent: () => {},
  showPostModal: () => {},
};

export default Feed;
