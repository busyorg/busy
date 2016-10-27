import React, { Component } from 'react';
import { has } from 'lodash/object';
import moment from 'moment';
import { Link } from 'react-router';
import steemembed from 'steemembed';
import BodyShort from './body-short';
import Mentions from './mentions';
import RepliesShort from './replies-short';
import Flag from './flag';
import Comments from './../comments/Comments';
import PostActionButtons from './PostActionButtons';
import Icon from './../widgets/Icon';

const colorCode = { green: 'rgba(39, 208, 169, 0.4)', red: 'rgba(249, 43, 97, 0.2)' };
const classCode = { green: 'grid-row-green', red: 'grid-row-red' };

const getJsonMetaData = (props) => {
  let jsonMetaData;
  try {
    jsonMetaData = JSON.parse(props.post.json_metadata);
  } catch (e) {
    jsonMetaData = {};
  }
  return jsonMetaData;
};


export default class PostFeed extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { post, onCommentRequest, bookmarks, toggleBookmark, notify } = this.props;
    const postPath = `/${post.parent_permlink}/@${post.author}/${post.permlink}`;

    let color = '';
    color = (post.net_votes > 0) && 'green';
    color = (post.net_votes < 0) && 'red';

    const netVotesBar = Math.abs(40 / 1000 * post.net_votes);
    const netVotesStyle = (color)
      ? { height: '4px', boxShadow: `inset ${netVotesBar}em 0 0 ${colorCode[color]}` }
      : {};

    const jsonMetaData = getJsonMetaData(this.props);

    const className = (color) ? `grid-row ${classCode[color]}` : 'grid-row';

    const imageName = has(jsonMetaData, 'image[0]') ? jsonMetaData.image[0] : '';
    const imagePath = imageName
      ? `https://img1.steemit.com/600x400/${imageName}`
      : '';

    const embeds = steemembed.getAll(post.body);

    return (
      <div className={className}>
        { post.first_reblogged_by &&
          <div className="cell cell-top">
            <ul>
              <li>
                <Icon name="repeat" small />
                { ' Reblogged by ' }
                <Link to={`/@${post.first_reblogged_by}`}>@{post.first_reblogged_by}</Link>
              </li>
            </ul>
          </div>
        }

        <div className="cell cell-top">
          <ul>
            <li>
              <Link to={`/@${post.author}`}>
                <span className="avatar avatar-xs">
                  <img src={`https://img.busy6.com/@${post.author}`} role="presentation" width="24" height="24" />
                </span>
                { ` @${post.author}` }
              </Link>

              { post.parent_author &&
                <span className="hidden-xs">
                      { ' replied ' }
                  <Link to={`/@${post.parent_author}`}>
                    @{post.parent_author}
                  </Link>
                  &#8217;s&nbsp;
                  <Link to={`/${post.category}/@${post.parent_author}/${post.parent_permlink}`}>
                    post.
                  </Link>
                </span>
              }

            </li>
            <li className="pull-right">
              { `${moment(post.created).fromNow()} ` }
              <a href="#" onClick={() => toggleBookmark(post.id)}>
                <Icon
                  small
                  name={has(bookmarks, post.id) ? 'bookmark' : 'bookmark_border'}
                />
              </a>
            </li>
          </ul>
        </div>

        { (imageName && !has(embeds, '[0].embed')) &&
          <div className="thumbs">
            <Link to={postPath}>
              <img src={imagePath} />
            </Link>
          </div>
        }

        { has(embeds, '[0].embed') &&
          <div className="thumbs" dangerouslySetInnerHTML={{ __html: embeds[0].embed }} />
        }

        <div className="cell cell-body">
          <h2>
            <Flag title={post.title} body={post.body} className="prs" />
            <Link to={postPath}>{post.title}</Link>
          </h2>

          <Mentions jsonMetaData={jsonMetaData} />

          <p>
            <BodyShort body={post.body} />
          </p>
        </div>

        <div style={netVotesStyle} />

        <div className="cell cell-bottom">
          <PostActionButtons
            post={post}
            notify={notify}
            onCommentRequest={onCommentRequest}
          />
        </div>

        <Comments postId={post.id} />

      </div>
    );
  }
}
