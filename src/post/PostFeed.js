import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Link } from 'react-router';
import steemembed from 'steemembed';
import BodyShort from './body-short';
import Mentions from './mentions';
import RepliesShort from './replies-short';
import Flag from './flag';
import Comments from './../comments/Comments';
import PostActionButtons from './PostActionButtons';

const colorCode = { green: 'rgba(39, 208, 169, 0.4)', red: 'rgba(249, 43, 97, 0.2)' };
const classCode = { green: 'grid-row-green', red: 'grid-row-red' };

export default class PostFeedItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const post = this.props.entry;
    const steemit = `/${post.parent_permlink}/@${post.author}/${post.permlink}`;
    let color = '';
    color = (post.net_votes > 0) ? 'green' : color;
    color = (post.net_votes < 0) ? 'red' : color;
    const bar = Math.abs(40 / 1000 * post.net_votes);
    const style = (color) ? { height: '4px', boxShadow: `inset ${bar}em 0 0 ${colorCode[color]}` } : {};
    let className = 'grid-row';
    className += (color) ? ` ${classCode[color]}` : '';
    try { var jsonMetadata = JSON.parse(post.json_metadata); }
    catch (e) { var jsonMetadata = {}; }
    let image = _.has(jsonMetadata, 'image[0]') ? jsonMetadata.image[0] : '';
    image = (image) ? `https://img1.steemit.com/600x400/${image}` : '';
    const embeds = steemembed.getAll(post.body);

    return (
      <div className={className}>
        {!_.isEmpty(post.first_reblogged_by) &&
          <div className="cell cell-top">
            <ul>
              <li><i className="icon icon-sm material-icons">repeat</i> Reblogged by <Link to={`/@${post.first_reblogged_by}`}>@{post.first_reblogged_by}</Link></li>
            </ul>
          </div>}
        <div className="cell cell-top">
          <ul>
            <li>
              <Link to={`/@${post.author}`}>
              <span className="avatar avatar-xs">
                <img src={`https://img.busy6.com/@${post.author}`} width="24" height="24" />
              </span> @{post.author}
              </Link>
              {!_.isEmpty(post.parent_author) &&
              <span className="hidden-xs"> replied&nbsp;
                <Link to={`/@${post.parent_author}`}>
                  @{post.parent_author}
                </Link>&#8217;s&nbsp;
                <Link to={`/${post.category}/@${post.parent_author}/${post.parent_permlink}`}>post.</Link>
              </span>}
            </li>
            <li className="pull-right">{moment(post.created).fromNow()}&nbsp;
              <a onClick={() => this.props.toggleBookmark(post.id)}>
                <i className="icon icon-sm material-icons">
                  {_.has(this.props.bookmarks, post.id) ? 'bookmark' : 'bookmark_border'}
                </i>
              </a>
            </li>
          </ul>
        </div>
        {image && !_.has(embeds, '[0].embed') && <div className="thumbs"><Link to={steemit}><img src={image} /></Link></div>}
        {_.has(embeds, '[0].embed') &&
        <div className="thumbs" dangerouslySetInnerHTML={{ __html: embeds[0].embed }} />}
        <div className="cell cell-body">
          <h2>
            <Flag title={post.title} body={post.body} className="prs" />
            <Link to={steemit}>{post.title}</Link>
          </h2>
          <Mentions jsonMetadata={jsonMetadata} />
          <p><BodyShort body={post.body} /></p>
        </div>
        <div style={style} />
        <div className="cell cell-bottom">
          <PostActionButtons
            post={post}
            notify={this.props.notify}
            onCommentRequest={this.props.onCommentRequest}
          />
        </div>

        <Comments postId={post.id} />

      </div>
    );
  }
}
