let React = require('react'),
  _ = require('lodash'),
  steemembed = require('steemembed'),
  numeral = require('numeral'),
  moment = require('moment'),
  actions = require('../actions'),
  RepliesShort = require('./replies-short'),
  BodyShort = require('./body-short'),
  PostActionButtons = require('./PostActionButtons'),
  Mentions = require('./mentions'),
  Link = require('react-router').Link;

import Flag from './flag';
import Comments from './../comments/Comments';

const colorCode = { green: 'rgba(39, 208, 169, 0.4)', red: 'rgba(249, 43, 97, 0.2)' };
const classCode = { green: 'grid-row-green', red: 'grid-row-red' };

module.exports = React.createClass({
  render() {
    const post = this.props.entry;
    const steemit = '/' + post.parent_permlink + '/@' + post.author + '/' + post.permlink;
    let color = '';
    color = (post.net_votes > 0) ? 'green' : color;
    color = (post.net_votes < 0) ? 'red' : color;
    const bar = Math.abs(40 / 1000 * post.net_votes);
    const style = (color) ? { height: '4px', boxShadow: 'inset ' + bar + 'em 0 0 ' + colorCode[color] } : {};
    let className = 'grid-row';
    className += (color) ? ' ' + classCode[color] : '';
    try { var jsonMetadata = JSON.parse(post.json_metadata); }
    catch (e) { var jsonMetadata = {}; }
    let image = _.has(jsonMetadata, 'image[0]') ? jsonMetadata.image[0] : '';
    image = (image) ? 'https://img1.steemit.com/600x400/' + image : '';
    const embeds = steemembed.getAll(post.body);
    return (
      <div className={className}>
        <div className="cell cell-top">
          <ul>
            <li>
              <Link to={'/@' + post.author} activeClassName="active">
                <span className="avatar avatar-xs">
                  <img src={'https://img.busy6.com/@' + post.author} width="24" height="24" />
                </span> @{post.author}
              </Link>
              {!_.isEmpty(post.parent_author) &&
              <span className="hidden-xs"> replied <Link to={'/@' + post.parent_author}>@{post.parent_author}</Link>'s <Link to={'/' + post.category + '/@' + post.parent_author + '/' + post.parent_permlink}>post.</Link>
              </span>}
            </li>
            <li className="pull-right">{moment(post.created).fromNow()} <a><i className="icon icon-sm material-icons">bookmark_border</i></a></li>
          </ul>
        </div>
        {image && !_.has(embeds, '[0].embed') && <div className="thumbs"><Link to={steemit}><img src={image} /></Link></div>}
        {_.has(embeds, '[0].embed') &&
          <div className="thumbs" dangerouslySetInnerHTML={{ __html: embeds[0].embed }} />}
        <div className="cell cell-body">
          <h2>
            <Flag title={post.title} body={post.body} />
            <Link to={steemit}>{post.title}</Link></h2>
          <Mentions jsonMetadata={jsonMetadata} />
          <p><BodyShort body={post.body} /></p>
        </div>
        <div style={style} />
        <div className="cell cell-bottom">
          <PostActionButtons
            post={post}
            onCommentRequest={this.props.onCommentRequest}
          />
        </div>

        <Comments postId={post.id} />
      </div>
    );
  }
});
