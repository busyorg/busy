import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import './PostRecommendation.less';
import { getUserFeedContent } from '../../feed/feedActions';

@injectIntl
@withRouter
@connect(null, { getUserFeedContent })
class PostRecommendation extends Component {
  static propTypes = {
    getUserFeedContent: PropTypes.func.isRequired,
    location: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
  };

  state = {
    recommendedPosts: [],
  };

  componentWillMount() {
    const { location } = this.props;
    if (location.pathname !== '/') {
      const username = location.pathname.split('/')[2].replace('@', '');
      this.props
        .getUserFeedContent({
          sortBy: 'blog',
          username,
          limit: 5,
        })
        .then((result) => {
          this.setState({
            recommendedPosts: result.payload.postsData,
          });
        });
    }
  }

  renderPosts = () => {
    const { intl } = this.props;

    return this.state.recommendedPosts.map((post) => {
      const commentsText = post.children === 1
        ? intl.formatMessage({ id: 'comment', defaultMessage: 'Comment' })
        : intl.formatMessage({ id: 'comments', defaultMessage: 'Comments' });
      return (
        <div className="PostRecommendation__link" key={post.id}>
          <Link to={`/${post.category}/@${post.author}/${post.permlink}`}>{post.title}</Link><br />
          {post.children > 0 &&
            <span>
              {post.children} {commentsText}
            </span>}
        </div>
      );
    });
  };

  render() {
    const { location, intl } = this.props;

    if (location.pathname === '/') {
      return <div />;
    }

    const username = location.pathname.split('/')[2].replace('@', '');
    return (
      <div className="PostRecommendation">
        <div className="PostRecommendation__title">
          {intl.formatMessage({ id: 'more_from', defaultMessage: 'More from' })}
          <Link to={`/@${username}`}>{` ${username}`}</Link>
        </div>
        {this.renderPosts()}
      </div>
    );
  }
}

export default PostRecommendation;
