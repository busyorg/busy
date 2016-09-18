var React = require("react"),
  Page = require("./../feed/page");

module.exports = React.createClass({
  render: function(){
    var account = this.props.params.name;
    return (
      <Page account={account} path={'@' + account + '/recent-replies'} />
    );
  }
});
