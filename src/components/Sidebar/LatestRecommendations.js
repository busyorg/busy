import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import BodyShort from '../Story/BodyShort';
import './LatestRecommendations.less';

const RenderRecommendedPost = ({ title, author, created, permlink }) =>
  (<div className="Recommendation">
    <div className="Recommendation__text">
      <div className="Recommendation__title">
        <Link to={`/@${author}/${permlink}`}>
          <BodyShort body={title} length={80} />
        </Link>
      </div>
      <div className="Recommendation__footer">
        <Link to={`/@${author}`} className="Recommendation__author">
          {author}
        </Link>
        <span className="Recommendation__bullet" />
        <span className="Recommendation__date">
          <FormattedRelative value={`${created}Z`} />
        </span>
      </div>
    </div>
  </div>);

RenderRecommendedPost.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  created: PropTypes.string.isRequired,
  permlink: PropTypes.string.isRequired,
};

const LatestRecommendations = ({ posts }) =>
  (<div className="LatestRecommendations">
    <div className="LatestRecommendations__container">
      <h4 className="LatestRecommendations__title">
        <i className="iconfont icon-flashlight_fill LatestRecommendations__icon" />
        {' '}
        <FormattedMessage id="latest_recommendations" defaultMessage="Latest Recommendations" />
      </h4>
      <div className="LatestRecommendations__divider" />
      {posts && posts.map(post => <RenderRecommendedPost key={post.id} {...post} />)}
      <div className="LatestRecommendations__divider" />
      <h4 className="LatestRecommendations__more">
        <Link to={'/latest-recommendations'}>
          <FormattedMessage id="see_all_recommendations" defaultMessage="See All Recommendations" />
        </Link>
      </h4>
    </div>
  </div>);

LatestRecommendations.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape()),
};

LatestRecommendations.defaultProps = {
  posts: [],
};

export default LatestRecommendations;
