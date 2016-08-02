var React = require('react'),
  _ = require('lodash'),
  striptags = require('striptags'),
  marked = require('marked'),
  ellipsis = require('text-ellipsis'),
  numeral = require('numeral'),
  moment = require('moment'),
  actions = require("../actions"),
  Link = require("react-router").Link;

var colorCode = {green: 'rgba(39, 208, 169, 0.15)', red: 'rgba(249, 43, 97, 0.1)'};
var classCode = {green: 'grid-row-green', red: 'grid-row-red'};

module.exports = React.createClass({
  render: function() {
    var steemit = 'https://steemit.com/' + this.props.entry.parent_permlink + '/@' + this.props.entry.author + '/' + this.props.entry.permlink;
    var self = this;
    var color = '';
    color = (this.props.entry.net_votes > 0)? 'green' : color;
    color = (this.props.entry.net_votes < 0)? 'red' : color;
    var bar = Math.abs(this.props.multiply * this.props.entry.net_votes * 9);
    var style = (color)? {boxShadow: 'inset ' + bar  + 'px 0 0 ' + colorCode[color]} : {};
    var className = 'grid-row';
    className += (color)? ' ' + classCode[color] : '';
    var jsonMetadata = JSON.parse(this.props.entry.json_metadata);
    var image = _.has(jsonMetadata, 'image[0]')? jsonMetadata.image[0] : '';
    return (
      <div className={className}>
        <div className="cell cell-top">
          <ul>
            <li><Link to={'/@' + this.props.entry.author} activeClassName="active"><i className="icon icon-sm material-icons">perm_identity</i> @{this.props.entry.author}</Link></li>
            <li className="hide hidden-xs"><a href="#"><i className="icon icon-sm material-icons">add_circle_outline</i> Follow</a></li>
            <li className="pull-right">{moment(this.props.entry.created).fromNow()} <a href="#"><i className="icon icon-sm material-icons">bookmark_border</i></a></li>
          </ul>
        </div>
        {image && <div className="thumbs"><a href={steemit} target="_blank"><img src={image} /></a></div>}
        <div className="cell cell-body">
          <h3><a href={steemit} target="_blank">{this.props.entry.title}</a></h3>
          <p dangerouslySetInnerHTML={{__html: ellipsis(striptags(marked(this.props.entry.body)), 255, {ellipsis: '…'})}} />
        </div>
        <div className="cell cell-bottom" style={style}>
          <ul>
            <li><a href="#"><i className="icon icon-sm material-icons">thumb_up</i></a> {numeral(this.props.entry.net_votes).format('0,0')} Likes</li>
            <li><i className="icon icon-sm material-icons">attach_money</i> {numeral(this.props.entry.pending_payout_value).format('$0,0.00')}</li>
            <li><a href="#"><i className="icon icon-sm material-icons">comment</i></a> {numeral(_.size(this.props.entry.replies)).format('0,0')} Comments</li>
            <li><a href="#"><i className="icon icon-sm material-icons">send</i> Share</a></li>
          </ul>
        </div>
      </div>
    )
  }
});