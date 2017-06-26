import React, { PropTypes } from 'react';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import BodyShort from '../Story/BodyShort';
import './LatestRecommendations.less';

const renderRecommendedPost = ({})

const LatestRecommendations = ({ posts }) => (
  <div className="LatestRecommendations">
    <div className="LatestRecommendations__container">
      <h4 className="LatestRecommendations__title"><i className="iconfont flashlight_fill LatestRecommendations__icon" /> Latest Recommendations</h4>
      <div className="LatestRecommendations__divider" />
      {posts && posts.map(post => renderRecommendedPost(post))}
    </div>
  </div>
);

LatestRecommendations.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape()),
};

LatestRecommendations.defaultProps = {
  posts: [],
};

export default LatestRecommendations;
