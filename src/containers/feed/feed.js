var React = require('react'),
  _ = require('lodash'),
  axios = require('axios'),
  Loading = require('./../loading'),
  AddPost = require('./../add-post'),
  Post = require('./../post/post');

module.exports = React.createClass({
  componentWillMount: function() {
    this.setState({
      isFetching: false,
      isLoaded: false,
      content: []
    });
    this._getState(this.props.path);
  },
  _getState: function(path) {
    this.setState({
      isFetching: true,
      isLoaded: false
    });
    axios.get('//api.steemjs.com/getState?path=' + path + '&scope=content')
      .then(response => {
        this.setState({
          isFetching: false,
          isLoaded: true,
          content: response.data
        });
      });
  },
  render: function(){
    return (
      <div className="grid">
        <div className="grid-content">
          <AddPost />
          {this.state.isFetching?
            <Loading /> :
            Object.keys(this.state.content).map(function(entry, key) {
              return <Post key={key} entry={this.state.content[entry]} />;
            }.bind(this))
          }
        </div>
      </div>
    );
  }
});



