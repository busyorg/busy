var React = require("react"),
  Page = require("./../feed/pageComponent");

module.exports = React.createClass({
  render: function(){
    var account = this.props.params.name;
    return (
      <Page account={account} path={'@' + account + '/posts'} sortBy="created" />
    );
  }
});
