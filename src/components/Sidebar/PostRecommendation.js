import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import './PostRecommendation.less';
import Loading from '../../components/Icon/Loading';
import steemAPI from '../../steemAPI';

@withRouter class PostRecommendation extends Component {
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

  getPostsByAuthor = (author) => {
    steemAPI
      .getDiscussionsByBlogAsync({
        tag: author,
        limit: 4,
      })
      .then((result) => {
        const recommendedPosts = Array.isArray(result) ? result : [];
        this.setState({
          recommendedPosts,
          loading: false,
          currentAuthor: author,
        });
      });
  };

  getFilteredPosts = () => {
    const currentPostPermlink = window.location.pathname.split('/')[3];
    return this.state.recommendedPosts
      .filter(post => post.permlink !== currentPostPermlink)
      .slice(0, 3);
  };

  navigateToPost = (author) => {
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
      <div className="PostRecommendation__link" key={post.id}>
        <Link
          to={`/${post.category}/@${post.author}/${post.permlink}`}
          onClick={() => this.navigateToPost(post.author)}
          className="PostRecommendation__link-title"
        >
          {post.title}
        </Link>
        <br />
        <FormattedMessage
          id="by"
          defaultMessage="By {username}"
          values={{
            username: <Link role="presentation" to={`/@${post.author}`}>{post.author}</Link>,
          }}
        />
        <br />
        {post.children > 0 &&
          <Link
            to={`/${post.category}/@${post.author}/${post.permlink}#comments`}
            onClick={() => this.navigateToPostComments()}
            className="PostRecommendation__comment-link"
          >
            {post.children === 1
              ? <FormattedMessage
                id="comment_count"
                values={{ count: <FormattedNumber value={post.children} /> }}
                defaultMessage="{count} comment"
              />
              : <FormattedMessage
                id="comments_count"
                values={{ count: <FormattedNumber value={post.children} /> }}
                defaultMessage="{count} comments"
              />}
          </Link>}
      </div>
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
      <div className="PostRecommendation">
        <h4 className="PostRecommendation__title SidebarBlock__content-title">
          <i className="iconfont icon-headlines PostRecommendation__icon" />
          {' '}
          <FormattedMessage id="recommended_posts" defaultMessage="Recommended Posts" />
        </h4>
        {this.renderPosts()}
      </div>
    );
  }
}

export default PostRecommendation;
