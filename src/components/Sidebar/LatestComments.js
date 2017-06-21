import React, { PropTypes } from 'react';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import './LatestComments.less';

const renderComment = ({ text, author, created, id }) => (
  <div className="Comment">
    <div className="Comment__text">
      <div className="Comment__content">
        {text}
      </div>
      <div className="Comment__footer">
        <Link to={`/@${author}`}>
          {author}
        </Link>
        <span className="LatestComment__bullet" />
        <span className="LatestComment__date">
          <Link to={id}>
            <FormattedRelative value={`${created}Z`} />
          </Link>
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
