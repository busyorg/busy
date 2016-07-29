var React = require('react'),
  ReactRedux = require("react-redux"),
  _ = require('lodash'),
  striptags = require('striptags'),
  marked = require('marked'),
  ellipsis = require('text-ellipsis'),
  numeral = require('numeral'),
  sortBy = require('sort-by'),
  actions = require("../actions"),
  Link = require("react-router").Link;

var colorCode = {green: 'rgba(39, 208, 169, 0.15)', red: 'rgba(249, 43, 97, 0.1)'};
var classCode = {green: 'grid-row-green', red: 'grid-row-red'};

var Grid = React.createClass({
  getInitialState: function() {
    var content = this.props.content;
    console.log('Grid', content);
    var multiply = this.getMultiply(content);
    return {
      sortBy: 'imp',
      sortOrder: 'desc',
      content: content,
      //total: this.props.total,
      multiply: multiply
    }
  },
  sortBy: function(a) {
    var sortOrder = (this.state.sortBy == a && this.state.sortOrder == 'desc')? 'asc' : 'desc';
    var orders = {'asc': '', 'desc': '-'};
    var content = this.state.content.sort(sortBy(orders[sortOrder] + a));
    var multiply = this.getMultiply(content);
    this.setState({
      sortBy: a,
      sortOrder: sortOrder,
      content: content,
      multiply: multiply
    });
  },
  getMultiply: function(content) {
    var max = 0;
    console.log(obj2Array(content));
    obj2Array(content).forEach(function(entry) {
      var net_votes = Math.abs(entry.net_votes);
      max = (net_votes > max)? net_votes : max;
    });
    max = 1000;
    var multiply = 100 / max;
    return multiply;
  },
  render: function() {
    var self = this;
    var i = 0;
    var content = this.state.content;
    return (
      <div className="grid">
        <div className="grid-content">
          {obj2Array(content).filter(function(key) {
            return key.title && key.title.toLowerCase().indexOf(self.props.filter.toLowerCase()) != -1;
          }).map(function(entry, key) {
            i++;
            return <Row multiply={self.state.multiply} entry={entry} />;
          })}
        </div>
      </div>
    )
  }
});

var Row = React.createClass({
  render: function() {
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
          <i className="icon icon-sm material-icons">perm_identity</i> @{this.props.entry.author} |
          <i className="icon icon-sm material-icons">add_circle_outline</i> Follow
          <i className="icon icon-sm material-icons pull-lg-right">bookmark_border</i>
        </div>
        <div className="thumbs"><img src={image} /></div>
        <div className="cell cell-body">
          <h3>{this.props.entry.title}</h3>
          <p dangerouslySetInnerHTML={{__html: ellipsis(striptags(marked(this.props.entry.body)), 255, {ellipsis: '…'})}} />
        </div>
        <div className="cell cell-bottom" style={style}>
          <i className="icon icon-sm material-icons">thumb_up</i> {numeral(this.props.entry.net_votes).format('0,0')} Likes |
          {numeral(this.props.entry.pending_payout_value).format('$0,0.00')} Reward |
          <i className="icon icon-sm material-icons">comment</i> {numeral(_.size(this.props.entry.replies)).format('0,0')} Comments |
          <i className="icon icon-sm material-icons">send</i> Share
        </div>
      </div>
    )
  }
});

var obj2Array = function(object){
  var array = [];
  for (var row in object) {
    array.push(object[row]);
  }
  return array;
};

var mapStateToProps = function(state){
  return {};
};

var mapDispatchToProps = function(dispatch){
  return {}
};

module.exports = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(Grid);