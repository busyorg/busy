import React, { PropTypes } from 'react';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router';
import Body from '../../post/Body';
import StoryFooter from './StoryFooter';
import Avatar from '../Avatar';
import './StoryFull.less';

const StoryFull = ({ post }) =>
  <div className="StoryFull">
    <h1 className="StoryFull__title">
      {post.title}
    </h1>
    <div className="StoryFull__header">
      <Avatar username={post.author} size={60} />
      <div className="StoryFull__header__text">
        <Link to={`/${post.author}`}>
          {post.author}
        </Link>
        <span className="StoryFull__header__text__date">
          <FormattedRelative value={`${post.created}Z`} />
        </span>
      </div>
    </div>
    <div className="StoryFull__content">
      <Body body={post.body} json_metadata={post.json_metadata} />
    </div>
    <StoryFooter post={post} />
  </div>;

StoryFull.propTypes = {
  post: PropTypes.shape(),
};

export default StoryFull;
