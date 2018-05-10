import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import './MoreCommentsButton.less';

const MoreCommentsButton = ({ comments, visibleComments, onClick }) => {
  if (comments === 0 || visibleComments >= comments) {
    return null;
  }
  return (
    <button className="MoreCommentsButton" onClick={onClick}>
      <span className="MoreCommentsButton__text">
        <FormattedMessage
          id="comment_show_more"
          defaultMessage="Show more comments ({count})"
          values={{
            count: comments - visibleComments,
          }}
        />
      </span>
      <i className="iconfont icon-unfold" />
    </button>
  );
};

MoreCommentsButton.propTypes = {
  comments: PropTypes.number.isRequired,
  visibleComments: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default MoreCommentsButton;
