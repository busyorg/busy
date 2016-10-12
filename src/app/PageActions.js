import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';

export default class PageActions extends Component {
  static propTypes = {
    // Follow Button
    followButton: PropTypes.bool,
    isFollowing: PropTypes.bool,
    isFollowingIsLoading: PropTypes.bool,
    onClickFollow: PropTypes.func,
  };

  renderFollowButton() {
    const {
      followButton,
      isFollowing,
      isFollowingIsLoading,
      onClickFollow
    } = this.props;

    if (!followButton) return null;

    // TODO - Add Tooltip
    return (
      <a
        href="#"
        className={classNames('trigger', {
          disabled: isFollowingIsLoading,
        })}
        onClick={onClickFollow}
      >
        <i className="icon icon-person-add material-icons">
          {isFollowing ? 'person outline' : 'person_add'}
        </i>
      </a>
    );
  }

  render() {
    let channel = '';
    if (this.props.params && this.props.params.name) {
      channel = `@${this.props.params.name}`;
    } else if (this.props.params && this.props.params.category) {
      channel = this.props.params.category;
    }

    return (
      <div className="actions">
       <div className="triggers">
         {this.renderFollowButton()}

          {this.props.edit && <Link to="/profile/edit" className="trigger"><i className="icon icon-md material-icons">format_paint</i></Link>}
          {this.props.likes && <a href="#replies" className="trigger"><i className="icon icon-md material-icons">thumb_up</i></a>}
          {this.props.replies && <a href="#replies" className="trigger"><i className="icon icon-md material-icons">reply</i></a>}
          {this.props.messages && <Link to={`/messages/${channel}`} className="trigger"><i className="icon icon-md material-icons">chat_bubble_outline</i></Link>}
          {this.props.add && <Link to="/write" className="trigger"><i className="icon icon-md material-icons">add</i></Link>}
        </div>
      </div>
    );
  }
}
