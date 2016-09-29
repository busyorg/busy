var React = require('react'),
  _ = require('lodash'),
  Link = require('react-router').Link;

module.exports = React.createClass({
  render: function(){
    var jsonMetadata = this.props.jsonMetadata;
    return (_.has(jsonMetadata, 'users') && _.size(jsonMetadata.users) <= 5 &&
      <p><span>Mention{_.size(jsonMetadata.users) > 1? 's' : ''} </span>
        {jsonMetadata.users.map(function(user, key) {
          return <span key={key}>
            {key > 0 && (key + 1) != jsonMetadata.users.length && <span>, </span>}
            {key != 0 && (key + 1) === jsonMetadata.users.length && <span> and </span>}
            <Link to={'/@' + user}>@{user}</Link>
          </span>;
        })}
      </p>
    );
  }
});
