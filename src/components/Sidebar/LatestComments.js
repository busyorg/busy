import React, { PropTypes } from 'react';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import BodyShort from '../Story/BodyShort';
import './LatestComments.less';

const renderComment = ({ text, author, created }) => (
  <div className="Comment">
    <div className="Comment__text">
      <div className="Comment__content">
        <BodyShort body={text} length={80} />
      </div>
      <div className="Comment__footer">
        <Link to={`/@${author}`} className="LatestComment__author">
          {author}
        </Link>
        <span className="LatestComment__bullet" />
        <span className="LatestComment__date">
          <FormattedRelative value={`${created}Z`} />
        </span>
      </div>
    </div>
  </div>
);

const LatestComments = ({ comments }) => (
  <div className="LatestComments">
    <div className="LatestComments__container">
      <h4 className="LatestComments__title"><i className="iconfont icon-time LatestComments__icon" /> Latest Comments</h4>
      <div className="LatestComments__divider" />
      {comments && comments.map(comment => renderComment(comment))}
      <div className="LatestComments__divider" />
      <h4 className="LatestComments__more">
        <Link to={'/latest-comments'}>
          Discover More Comments
        </Link>
      </h4>
    </div>
  </div>
);

LatestComments.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.shape()),
};

LatestComments.defaultProps = {
  comments: [],
};

export default LatestComments;
