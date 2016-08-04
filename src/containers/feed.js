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

module.exports = React.createClass({
  getInitialState: function() {
    var content = this.props.content;
    return {
      sortBy: 'imp',
      sortOrder: 'desc',
      content: content,
      //total: this.props.total,
    }
  },
  sortBy: function(a) {
    var sortOrder = (this.state.sortBy == a && this.state.sortOrder == 'desc')? 'asc' : 'desc';
    var orders = {'asc': '', 'desc': '-'};
    var content = this.state.content.sort(sortBy(orders[sortOrder] + a));
    this.setState({
      sortBy: a,
      sortOrder: sortOrder,
      content: content
    });
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
            return <Post entry={entry} />;
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