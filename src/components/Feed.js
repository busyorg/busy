import React from 'react';
import InfiniteScroll from 'redux-infinite-scroll';
import Story from './Story/Story';
import Loading from '../widgets/Loading';
import { post } from '../stories.data';
import './Feed.less';

class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      posts: [],
    };
  }

  loadMore() {
    this.setState({
      loading: true,
    });

    this.timeout = setTimeout(() => this.setMore(), 500);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  setMore() {
    this.setState({
      posts: [
        ...this.state.posts,
        post,
      ],
      loading: false,
    });
  }

  render() {
    // TODO: Use post id for key prop on real data

    const { posts, loading } = this.state;

    return (
      <div className="Feed">
        <InfiniteScroll
          loadingMore={loading}
          loader={<Loading />}
          loadMore={() => this.loadMore()}
          elementIsScrollable={false}
        >
          {posts && posts.map((entry, i) => <Story key={i} post={entry} />)}
        </InfiniteScroll>
      </div>);
  }
}

export default Feed;
