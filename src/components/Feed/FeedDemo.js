import React from 'react';
import Feed from './Feed';
import { post } from '../../stories.data';
import './FeedDemo.less';

class FeedDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasMore: true,
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
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  setMore() {
    this.setState({
      posts: [
        ...this.state.posts,
        post,
        post,
        post,
        post,
        post,
      ],
      loading: false,
      hasMore: this.state.posts.length < 4,
    });
  }

  render() {
    const { posts, loading, hasMore } = this.state;

    return (<div className="FeedDemo">
      <Feed
        posts={posts}
        isLoading={loading}
        hasMore={hasMore}
        onLoadMore={() => this.loadMore()}
      />
    </div>);
  }
}

export default FeedDemo;
