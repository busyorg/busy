import React from 'react';
import { Link } from 'react-router';
import { FormattedRelative } from 'react-intl';

import Body from './Body';
import AuthorBio from './AuthorBio';
import Icon from '../widgets/Icon';
import Comments from '../comments/Comments';
import Avatar from '../widgets/Avatar';

import './PostSingleContent.scss';

const PostSingleContent = ({ content, toggleBookmark, bookmarks }) => {
  let jsonMetadata = {};
  try { jsonMetadata = JSON.parse(content.json_metadata); } catch (e) { }
  return (
    <div className="PostSingleContent">
      <div className="container">
        <div className="PostSingleContent__header my-2">
          <Link to={`/@${content.author}`}>
            <Avatar sm username={content.author} />
            { ' ' }
            <span>
              @{content.author}
            </span>
          </Link>
          <span className="hidden-xs">
            { ' in ' }
            <Link to={`/hot/${content.category}`}>#{content.category}</Link>
          </span>
          <span className="pull-right">
            <FormattedRelative value={content.created} />
            <a onClick={() => toggleBookmark(content.id)}>
              <Icon
                small
                name={bookmarks[content.id] ? 'bookmark' : 'bookmark_border'}
              />
            </a>

          </span>
        </div>

        <div className="PostSingleContent__content my-2">
          <h1 className="mvl">{content.title}</h1>
          <Body body={content.body} jsonMetadata={content.json_metadata} />
          { jsonMetadata.tags &&
            <div className="my-2">
              { jsonMetadata.tags.map(tag => (
                <span key={tag}>
                  <Link to={`/hot/${tag}`} className="tag tag-default">{tag}</Link>{ ' ' }
                </span>
              ))}
            </div>
          }
          <AuthorBio authorName={content.author} />
        </div>
      </div>

      { content.children > 0 && (
        <div className="PostSingleContent__replies py-3">
          <div className="container">
            <h1><Icon name="reply" lg /> Comments ({content.children})</h1>
            <Comments
              postId={content.id}
              show
              isSinglePage
            />
          </div>
        </div>
      ) }
    </div>
  );
};

export default PostSingleContent;
