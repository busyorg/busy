import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Tooltip } from 'antd';
import apps from '../../helpers/apps';
import { jsonParse } from '../../helpers/formatter';
import './PostedFromEmbed.less';

const PostedFromEmbed = ({ post }) => (
  <span>
    <span className="PostedFrom__bullet" />
    <Tooltip
      title={
        <span>
          <FormattedMessage
            id="posted_from_tooltip"
            defaultMessage={'Version: {version}'}
            values={{ version: jsonParse(post.json_metadata).app.split('/')[1] }}
          />
        </span>
      }
    >
      <span className="PostedFrom__text">
        <FormattedMessage
          id="posted_from"
          defaultMessage={'{from}'}
          values={{
            from:
              apps[jsonParse(post.json_metadata).app.split('/')[0]]
              || jsonParse(post.json_metadata).app.split('/')[0],
          }}
        />
      </span>
    </Tooltip>
  </span>
);

PostedFromEmbed.propTypes = {
  post: PropTypes.shape().isRequired,
};

export default PostedFromEmbed;
