var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div className="hide grid-row grid-row-green">
        <div className="cell cell-top">
          <ul>
            <li><a href="#"><i className="icon icon-sm material-icons">picture_in_picture</i></a></li>
            <li><a href="#"><i className="icon icon-sm material-icons">live_help</i></a></li>
            <li><a href="#"><i className="icon icon-sm material-icons">camera_alt</i></a></li>
            <li><a href="#"><i className="icon icon-sm material-icons">insert_photo</i></a></li>
            <li><a href="#"><i className="icon icon-sm material-icons">collections</i></a></li>
            <li><a href="#"><i className="icon icon-sm material-icons">videocam</i></a></li>
          </ul>
        </div>
        <p className="pal">Who's up bro?</p>
      </div>
    )
  }
});