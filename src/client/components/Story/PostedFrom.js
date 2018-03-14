import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Tooltip } from 'antd';
import './PostedFrom.less';
import { getAppData } from '../../helpers/postHelpers';

const PostedFrom = ({ post }) => {
  const { appName, version } = getAppData(post);
  if (!appName) {
    return null;
  }

  return (
    <span className="PostedFrom">
      <span className="PostedFrom__bullet" />
      <Tooltip
        title={
          version && (
            <span>
              <FormattedMessage
                id="posted_from_tooltip"
                defaultMessage={'Version: {version}'}
                values={{ version }}
              />
            </span>
          )
        }
      >
        <span className="PostedFrom__text">{appName}</span>
      </Tooltip>
    </span>
  );
};

PostedFrom.propTypes = {
  post: PropTypes.shape().isRequired,
};

export default PostedFrom;
