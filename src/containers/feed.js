var React = require('react'),
  _ = require('lodash'),
  AddPost = require('./add-post'),
  Post = require('./post/post');

module.exports = React.createClass({
  render: function() {
    var self = this;
    var content = this.props.content;
    return (
      <div className="grid">
        <div className="grid-content">
          <AddPost />
          {obj2Array(content).filter(function(key) {
            return key.title && key.title.toLowerCase().indexOf(self.props.filter.toLowerCase()) != -1;
          }).map(function(entry, key) {
            return <Post key={key} entry={entry} />;
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