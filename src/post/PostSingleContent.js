import React from 'react';
import moment from 'moment';
import { Link } from 'react-router';

import Body from './body';
import Comments from '../comments/Comments';
import Avatar from '../widgets/Avatar';

import './PostSingleContent.scss';

const PostSingleContent = ({ content }) => {
  return (
    <div className="PostSingleContent">
      <div className="container">
        <div className="PostSingleContent__header my-2">
          <Link to={`/@${content.author}`}>
            <Avatar sm username={content.author} className="pull-left" />
            <span className="pull-left mls">
              @{content.author}
              <span className="hidden-xs">
                { ' ' }in <Link to={`/trending/${content.category}`}>#{content.category}</Link>
              </span>
            </span>
          </Link>
          <span className="pull-right">
            {moment(content.created).fromNow()}
            <a><i className="icon icon-md material-icons">bookmark_border</i></a>
          </span>
        </div>

        <div className="PostSingleContent__content my-2">
          <h1 className="mvl">{content.title}</h1>
          <Body body={content.body} jsonMetadata={content.json_metadata} />
        </div>
      </div>

      { content.children > 0 && (
        <div className="PostSingleContent__replies py-3">
          <div className="container">
            <h1>Comments</h1>
            <Comments postId={content.id} />
          </div>
        </div>
      ) }
    </div>
  );
};

export default PostSingleContent;
