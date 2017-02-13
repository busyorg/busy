import React, { Component, PropTypes } from 'react';
import { Tooltip } from 'pui-react-tooltip';
import { OverlayTrigger } from 'pui-react-overlay-trigger';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { showSidebar } from '../actions';
import Icon from '../widgets/Icon';
import Status from '../widgets/Status';
import FavoriteButton from '../favorites/FavoriteButton';
import * as favoriteActions from '../favorites/favoritesActions';
import './Header.scss';

@connect(
  state => ({
    app: state.app,
    auth: state.auth,
    favorites: state.favorites.categories,
    messages: state.messages,
  }),
  dispatch => bindActionCreators({
    showSidebar,
    addCategoryFavorite: favoriteActions.addCategoryFavorite,
    removeCategoryFavorite: favoriteActions.removeCategoryFavorite,
  }, dispatch)
)
export default class Header extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    showSidebar: PropTypes.func,
    title: PropTypes.string,
  };

  render() {
    const { username, category, sortBy } = this.props;
    return (
      <header>
        <div className="top-nav">
          <div className="ml-2 left">
            {!this.props.app.sidebarIsVisible &&
              <a onClick={() => this.props.showSidebar()}>
                <Icon name="menu" className="Icon--menu" />
              </a>
            }
            {category &&
              <span>
                <Link
                  className="Header__title ml-3 mr-1"
                  to={category === 'general' ? '/trending' : `/trending/${category}`}
                >
                  <span className="text-info">#</span>
                  {` ${category}`}
                </Link>
                {sortBy &&
                  `/${sortBy} `
                }
                {category !== 'general' &&
                  <FavoriteButton
                    name={category}
                    isFavorited={this.props.favorites.includes(category)}
                    onClick={this.props.favorites.includes(category)
                      ? () => this.props.removeCategoryFavorite(category)
                      : () => this.props.addCategoryFavorite(category)
                    }
                  />
                }
                {' '}
                <Link
                  to={`/messages/${category}`}
                  className="ml-2"
                >
                  {' '}<Icon name="chat_bubble_outline" sm />
                  {' '}Chat
                </Link>
              </span>
            }
            {username &&
              <span>
                <Link
                  className="Header__title ml-3"
                  to={`/@${username}`}
                >
                  <span className="text-info">@</span>
                  {` ${username}`}
                </Link>
                <Status isOnline={!!this.props.messages.users[username]} />
                {' '}
                <Link
                  to={`/messages/@${username}`}
                  className="ml-2"
                >
                  {' '}<Icon name="chat_bubble_outline" sm />
                  {' '}Message
                </Link>
              </span>
            }
          </div>
          {this.props.auth.isAuthenticated
            ? <div className="right mr-2">

              <OverlayTrigger placement="bottom" overlay={<Tooltip>Home</Tooltip>}>
                <Link to="/">
                  <Icon name="home" className="Icon--menu" />
                </Link>
              </OverlayTrigger>
              <OverlayTrigger placement="bottom" overlay={<Tooltip>Write</Tooltip>}>
                <Link to="/write">
                  <Icon name="add" className="Icon--menu" />
                </Link>
              </OverlayTrigger>
              <OverlayTrigger placement="bottom" overlay={<Tooltip>Bookmarks</Tooltip>}>
                <Link to="/bookmarks">
                  <Icon name="bookmarks" className="Icon--menu" />
                </Link>
              </OverlayTrigger>
              <OverlayTrigger placement="bottom" overlay={<Tooltip>Help</Tooltip>}>
                <Link to="/help">
                  <Icon name="help_outline" className="Icon--menu" />
                </Link>
              </OverlayTrigger>
            </div>
            : <div className="right mr-2">
              <OverlayTrigger placement="bottom" overlay={<Tooltip>Help</Tooltip>}>
                <Link to="/help">
                  <Icon name="help_outline" className="Icon--menu" />
                </Link>
              </OverlayTrigger>
            </div>
          }
        </div>

        {this.props.children &&
          <div className="app-nav">
            {this.props.children}
          </div>
        }
      </header>
    );
  }
}

