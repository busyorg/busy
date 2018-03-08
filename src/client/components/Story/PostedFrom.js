import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Tooltip } from 'antd';
import './PostedFrom.less';
import { getAppData } from '../../helpers/postHelpers';

const PostedFrom = ({ post }) => {
  const { from, version } = getAppData(post);
  if (!from) {
    return null;
  }

  return (
    <span className="PostedFrom">
      <span className="PostedFrom__bullet" />
      <Tooltip
        title={
          <span>
            <FormattedMessage
              id="posted_from_tooltip"
              defaultMessage={'Version: {version}'}
              values={{ version }}
            />
          </span>
        }
      >
        <span className="PostedFrom__text">{from}</span>
      </Tooltip>
    </span>
  );
};

PostedFrom.propTypes = {
  post: PropTypes.shape().isRequired,
};

export default PostedFrom;
