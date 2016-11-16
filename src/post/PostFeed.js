import React, { Component } from 'react';
import { FormattedRelative } from 'react-intl';
import { has } from 'lodash/object';
import { Link } from 'react-router';
import steemembed from 'steemembed';
import BodyShort from './body-short';
import Mentions from './mentions';
import Flag from './flag';
import Comments from '../comments/Comments';
import PostActionButtons from './PostActionButtons';
import Icon from '../widgets/Icon';
import Avatar from '../widgets/Avatar';
import PostModalLink from './PostModalLink';

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
    this.state = {
      showComments: false,
    };
  }

  handleShowCommentsRequest = () => {
    this.setState({ showComments: true });
  };

  render() {
    const { post, onCommentRequest, bookmarks, toggleBookmark, notify } = this.props;

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
                <Icon name="repeat" s />
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
                <Avatar xs username={post.author} />
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
              <FormattedRelative value={post.created} />{' '}
              <a onClick={() => toggleBookmark(post.id)}>
                <Icon
                  small
                  name={bookmarks[post.id] ? 'bookmark' : 'bookmark_border'}
                />
              </a>
            </li>
          </ul>
        </div>

        { (imageName && !has(embeds, '[0].embed')) &&
          <div className="thumbs">
            <PostModalLink
              post={post}
              onClick={() => this.props.openPostModal(post.id)}
            >
              <img src={imagePath} />
            </PostModalLink>
          </div>
        }

        { has(embeds, '[0].embed') &&
          <div className="thumbs" dangerouslySetInnerHTML={{ __html: embeds[0].embed }} />
        }

        <div className="cell cell-body">
          <h2>
            <Flag title={post.title} body={post.body} className="prs" />
            <PostModalLink
              post={post}
              onClick={() => this.props.openPostModal(post.id)}
            >
              {post.title}
            </PostModalLink>
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
            onShowCommentsRequest={this.handleShowCommentsRequest}
            reblog={this.props.reblog}
            isReblogged={this.props.isReblogged}
          />
        </div>

        { this.state.showComments &&
          <Comments postId={post.id} />
        }

      </div>
    );
  }
}
