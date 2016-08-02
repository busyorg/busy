var React = require('react'),
  _ = require('lodash'),
  striptags = require('striptags'),
  marked = require('marked'),
  ellipsis = require('text-ellipsis'),
  numeral = require('numeral'),
  sortBy = require('sort-by'),
  actions = require("../actions"),
  AddPost = require('./add-post'),
  Post = require('./post');

var colorCode = {green: 'rgba(39, 208, 169, 0.15)', red: 'rgba(249, 43, 97, 0.1)'};
var classCode = {green: 'grid-row-green', red: 'grid-row-red'};

module.exports = React.createClass({
  getInitialState: function() {
    var content = this.props.content;
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
          <AddPost />
          {obj2Array(content).filter(function(key) {
            return key.title && key.title.toLowerCase().indexOf(self.props.filter.toLowerCase()) != -1;
          }).map(function(entry, key) {
            i++;
            return <Post multiply={self.state.multiply} entry={entry} />;
          })}
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