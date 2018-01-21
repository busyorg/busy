import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Loading from '../../components/Icon/Loading';
import steemAPI from '../../steemAPI';
import PostRecommendationLink from './PostRecommendationLink';
import './PostRecommendation.less';
import './SidebarContentBlock.less';

@withRouter
class PostRecommendation extends Component {
  static propTypes = {
    location: PropTypes.shape().isRequired,
    isAuthFetching: PropTypes.bool.isRequired,
  };

  state = {
    recommendedPosts: [],
    loading: false,
    currentAuthor: '',
  };

  componentWillMount() {
    const { location, isAuthFetching } = this.props;
    if (!isAuthFetching && location.pathname !== '/') {
      const currentAuthor = location.pathname.split('/')[2].replace('@', '');
      this.setState({
        loading: true,
      });
      this.getPostsByAuthor(currentAuthor);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isAuthFetching !== nextProps.isAuthFetching) {
      const currentAuthor = this.props.location.pathname.split('/')[2].replace('@', '');
      this.setState({
        loading: true,
      });
      this.getPostsByAuthor(currentAuthor);
    }
  }

  getPostsByAuthor = author => {
    steemAPI
      .sendAsync('get_discussions_by_blog', [
        {
          tag: author,
          limit: 4,
        },
      ])
      .then(result => {
        const recommendedPosts = Array.isArray(result) ? result : [];
        this.setState({
          recommendedPosts,
          loading: false,
          currentAuthor: author,
        });
      });
  };

  getFilteredPosts = () => {
    const currentPostPermlink = this.props.location.pathname.split('/')[3];
    return this.state.recommendedPosts
      .filter(post => post.permlink !== currentPostPermlink)
      .slice(0, 3);
  };

  navigateToPost = author => {
    window.scrollTo(0, 0);

    if (author !== this.state.currentAuthor) {
      this.getPostsByAuthor(author);
    } else {
      this.forceUpdate();
    }
  };

  navigateToPostComments = () => {
    document.getElementById('comments').scrollIntoView();
    this.forceUpdate();
  };

  renderPosts = () => {
    const filteredRecommendedPosts = this.getFilteredPosts();

    return filteredRecommendedPosts.map(post => (
      <PostRecommendationLink
        post={post}
        navigateToPost={this.navigateToPost}
        navigateToPostComments={this.navigateToPostComments}
        key={post.id}
      />
    ));
  };

  render() {
    const { loading } = this.state;
    const filteredRecommendedPosts = this.getFilteredPosts();

    if (loading) {
      return <Loading />;
    }

    if (filteredRecommendedPosts.length === 0) {
      return <div />;
    }

    return (
      <div className="SidebarContentBlock">
        <h4 className="SidebarContentBlock__title">
          <i className="iconfont icon-headlines SidebarContentBlock__icon" />{' '}
          <FormattedMessage id="recommended_posts" defaultMessage="Recommended Posts" />
        </h4>
        <div className="SidebarContentBlock__content">{this.renderPosts()}</div>
      </div>
    );
  }
}

export default PostRecommendation;
