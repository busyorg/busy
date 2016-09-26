var React = require("react"),
  Page = require("./page");

module.exports = React.createClass({
  render: function(){
    return (
      <Page
        {...this.props}
        path="trending"
      />
    );
  }
});
