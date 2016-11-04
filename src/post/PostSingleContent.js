import React from 'react';
import moment from 'moment';
import { Link } from 'react-router';
import Body from './body';
import Comments from './../comments/Comments';

const PostSingleContent = ({ content }) => {
  return (
    <div className="single">
      <div className="container">
        <div
          style={{
              overflow: 'hidden',
              height: '40px',
              lineHeight: '40px',
              marginTop: '15px',
            }}
        >
          <Link to={'/@' + content.author}>
          <span className="avatar avatar-sm pull-left">
            <img src={'https://img.busy.org/@' + content.author} width="40" height="40" />
          </span>
          <span className="pull-left mls">
            @{content.author}
          </span>
          </Link>

        <span className="pull-right">
          {moment(content.created).fromNow()}
          <a><i className="icon icon-md material-icons">bookmark_border</i></a>
        </span>
        </div>

        <div className="single-content">
          <h1 className="mvl">{content.title}</h1>
          <Body body={content.body} jsonMetadata={content.json_metadata} />
        </div>

        { content.children > 0 && (
          <div className="single-replies">
            <h2>Comments</h2>
            <Comments postId={content.id} />
          </div>
        )
        }
      </div>
    </div>
  );
};

export default PostSingleContent;
