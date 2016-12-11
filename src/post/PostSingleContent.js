import React from 'react';
import moment from 'moment';
import { Link } from 'react-router';

import Body from './body';
import Icon from '../widgets/Icon';
import Comments from '../comments/Comments';
import Avatar from '../widgets/Avatar';

import './PostSingleContent.scss';

const PostSingleContent = ({ content }) => {
  let jsonMetadata = {};
  try { jsonMetadata = JSON.parse(content.json_metadata); } catch (e) { }
  return (
    <div className="PostSingleContent">
      <div className="container">
        <div className="PostSingleContent__header my-2">
          <Link to={`/@${content.author}`}>
            <Avatar sm username={content.author} className="pull-left" />
            <span className="mls">
              @{content.author}
            </span>
          </Link>
          <span className="hidden-xs">
            { ' in ' }
            <Link to={`/hot/${content.category}`}>#{content.category}</Link>
          </span>
          <span className="pull-right">
            {moment(content.created).fromNow()}
            <a><i className="icon icon-md material-icons">bookmark_border</i></a>
          </span>
        </div>

        <div className="PostSingleContent__content my-2">
          <h1 className="mvl">{content.title}</h1>
          <Body body={content.body} jsonMetadata={content.json_metadata} />
          { jsonMetadata.tags &&
            <div className="my-2">
              { jsonMetadata.tags.map(tag => (
                <span>
                  <Link to={`/hot/${tag}`} className="tag tag-default">{tag}</Link>{ ' ' }
                </span>
              ))}
            </div>
          }
        </div>
      </div>

      { content.children > 0 && (
        <div className="PostSingleContent__replies py-3">
          <div className="container">
            <h1><Icon name="reply" lg /> Comments ({content.children})</h1>
            <Comments
              postId={content.id}
              show
            />
          </div>
        </div>
      ) }
    </div>
  );
};

export default PostSingleContent;
