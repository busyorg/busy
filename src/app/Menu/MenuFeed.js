import React from 'react';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Icon from '../../widgets/Icon';

const MenuFeed = ({ auth, category }) => {
  const categoryUrl = category ? `/${category}` : '';
  const channel = category || 'general';
  return (
    <ul className="app-nav">
      <li>
        <NavLink to={`/trending${categoryUrl}`} onlyActiveOnIndex activeClassName="active">
          <Icon name="show_chart" />
          <span className="hidden-xs">
            {' '}<FormattedMessage id="trending" defaultMessage="Trending" />
          </span>
        </NavLink>
      </li>
      <li>
        <NavLink to={`/created${categoryUrl}`} activeClassName="active">
          <Icon name="fiber_new" />
          <span className="hidden-xs">
            {' '}<FormattedMessage id="new" defaultMessage="New" />
          </span>
        </NavLink>
      </li>
      <li>
        <NavLink to={`/hot${categoryUrl}`} activeClassName="active">
          <Icon name="whatshot" />
          <span className="hidden-xs">
            {' '}<FormattedMessage id="hot" defaultMessage="Hot" />
          </span>
        </NavLink>
      </li>
      <li>
        <NavLink to={`/active${categoryUrl}`} activeClassName="active">
          <Icon name="track_changes" />
          <span className="hidden-xs">
            {' '}<FormattedMessage id="active" defaultMessage="Active" />
          </span>
        </NavLink>
      </li>
      {auth.isAuthenticated &&
        <li>
          <NavLink to={`/messages/${channel}`} activeClassName="active">
            <Icon name="chat_bubble_outline" />
            <span className="hidden-xs">
              {' '}<FormattedMessage id="chat" defaultMessage="Chat" />
            </span>
          </NavLink>
        </li>
      }
    </ul>
  );
};

export default MenuFeed;
