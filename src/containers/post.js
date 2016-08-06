var React = require('react'),
  _ = require('lodash'),
  steemembed = require('steemembed'),
  striptags = require('striptags'),
  marked = require('marked'),
  ellipsis = require('text-ellipsis'),
  franc = require('franc'),
  numeral = require('numeral'),
  moment = require('moment'),
  actions = require("../actions"),
  cloudinary = require('cloudinary'),
  Link = require("react-router").Link;

cloudinary.config('cloud_name', 'huvgywhku');
cloudinary.config('api_key', '992272288114383');
cloudinary.config('api_secret', 'enA36tsC5t6FKcFvm9trm4GdLSI');

var colorCode = {green: 'rgba(39, 208, 169, 0.4)', red: 'rgba(249, 43, 97, 0.2)'};
var classCode = {green: 'grid-row-green', red: 'grid-row-red'};

module.exports = React.createClass({
  render: function() {
    var steemit = '/' + this.props.entry.parent_permlink + '/@' + this.props.entry.author + '/' + this.props.entry.permlink;
    var color = '';
    color = (this.props.entry.net_votes > 0)? 'green' : color;
    color = (this.props.entry.net_votes < 0)? 'red' : color;
    var bar = Math.abs(0.1 * this.props.entry.net_votes * 9);
    var style = (color)? {height: '4px', boxShadow: 'inset ' + bar  + 'px 0 0 ' + colorCode[color]} : {};
    var className = 'grid-row';
    className += (color)? ' ' + classCode[color] : '';
    try { var jsonMetadata = JSON.parse(this.props.entry.json_metadata); }
    catch(e) { var jsonMetadata = {}; }

    var image = _.has(jsonMetadata, 'image[0]')? jsonMetadata.image[0] : '';
    /*
    cloudinary.uploader.upload(image, function(result) {
      console.log(result);
    });
    image = (image)? cloudinary.url(image, {secure: true, width: 600, height: 400, crop: 'fill'}) : '';
    */

    var body = striptags(marked(this.props.entry.body));
    body = body.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
	  var embeds = [];
    if (_.has(jsonMetadata, 'links')) {
      jsonMetadata.links.forEach(function(link) {
        var embed = steemembed.get(link);
        if (embed) embeds.push(embed);
      });
    }
    var language = franc(this.props.entry.title + ' ' + body);
    var textLength = (this.props.entry.title + ' ' + body).length;
    return (
      <div className={className}>
        <div className="cell cell-top">
          <ul>
            <li><Link to={'/@' + this.props.entry.author} activeClassName="active"><i className="icon icon-sm material-icons">perm_identity</i> @{this.props.entry.author}</Link></li>
            <li className="hide hidden-xs"><a href="#"><i className="icon icon-sm material-icons">add_circle_outline</i> Follow</a></li>
            <li className="pull-right">{moment(this.props.entry.created).fromNow()} <a href="#"><i className="icon icon-sm material-icons">bookmark_border</i></a></li>
          </ul>
        </div>
        {image && !_.has(embeds, '[0].embed') && <div className="thumbs"><Link to={steemit}><img src={image} /></Link></div>}
        {_.has(embeds, '[0].embed') &&
          <div className="thumbs">
            <div dangerouslySetInnerHTML={{__html: embeds[0].embed}} />
          </div>}
        <div className="cell cell-body">
          <h3><Link to={steemit}>{language != 'eng' && textLength > 100 && <img className="flag" src={'/img/flag/' + language.substr(0, 2) + '.svg'} />} {this.props.entry.title}</Link></h3>
          <p dangerouslySetInnerHTML={{__html: ellipsis(body, 255, {ellipsis: '…'})}} />
        </div>
        <div style={style}></div>
        <div className="cell cell-bottom">
          <ul>
            <li><a href="#"><i className="icon icon-sm material-icons">thumb_up</i></a> {numeral(this.props.entry.net_votes).format('0,0')}<span className="hidden-xs"> Likes</span></li>
            <li><span className="hidden-xs"><i className="icon icon-sm material-icons">attach_money</i> </span>{numeral(this.props.entry.total_pending_payout_value).format('$0,0.00')}</li>
            <li><a href="#"><i className="icon icon-sm material-icons">comment</i></a> {numeral(this.props.entry.children).format('0,0')}<span className="hidden-xs"> Comments</span></li>
            <li><a href="#"><i className="icon icon-sm material-icons">send</i><span className="hidden-xs"> Share</span></a></li>
          </ul>
        </div>
      </div>
    )
  }
});