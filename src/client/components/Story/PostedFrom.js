import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Tooltip } from 'antd';
import apps from '../../helpers/apps';
import { jsonParse } from '../../helpers/formatter';
import './PostedFrom.less';

const PostedFrom = props => {
  let from;
  let version;
  try {
    const app = jsonParse(props.post.json_metadata).app.split('/');
    from = apps[app[0]];
    version = app[1];
  } catch (e) {
    return <div />;
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
