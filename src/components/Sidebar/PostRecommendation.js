import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import './PostRecommendation.less';
import Loading from '../../components/Icon/Loading';
import steemAPI from '../../steemAPI';

@injectIntl
@withRouter
class PostRecommendation extends Component {
  static propTypes = {
    location: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
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

  navigateToPost = (category, author, permlink) => {
    this.props.history.push(`/${category}/@${author}/${permlink}`);
    window.scrollTo(0, 0);

    if (author !== this.state.currentAuthor) {
      this.getPostsByAuthor(author);
    } else {
      this.forceUpdate();
    }
  };

  navigateToPostComments = (category, author, permlink) => {
    this.props.history.push(`/${category}/@${author}/${permlink}#comments`);
    this.forceUpdate();
  };

  renderPosts = () => {
    const { intl } = this.props;
    const filteredRecommendedPosts = this.getFilteredPosts();

    return filteredRecommendedPosts.map((post) => {
      const commentsText = post.children === 1
        ? intl.formatMessage({ id: 'comment', defaultMessage: 'Comment' })
        : intl.formatMessage({ id: 'comments', defaultMessage: 'Comments' });
      return (
        <div className="PostRecommendation__link" key={post.id}>
          <a
            role="presentation"
            onClick={() => this.navigateToPost(post.category, post.author, post.permlink)}
            className="PostRecommendation__link-title"
          >
            {post.title}
          </a>
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
            <a
              role="presentation"
              onClick={() => this.navigateToPostComments(post.category, post.author, post.permlink)}
              className="PostRecommendation__comment-link"
            >
              {post.children}
              {' '}
              {commentsText}
            </a>}
        </div>
      );
    });
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
