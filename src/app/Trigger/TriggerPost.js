import React from 'react';
import { Link } from 'react-router';

const TriggerPost = React.createClass({
  render() {
    return (
      <div className="actions">
        <div className="triggers">
          <a className="trigger"><i className="icon icon-md material-icons">thumb_up</i></a>
          <a className="trigger"><i className="icon icon-md material-icons">reply</i></a>
          <a className="trigger" onClick={this.props.onClickReblog}><i className="icon material-icons">repeat</i></a>
        </div>
      </div>
    );
  }
});

module.exports = TriggerPost;
