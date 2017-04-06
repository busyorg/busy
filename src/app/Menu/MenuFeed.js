import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import Icon from '../../widgets/Icon';

const MenuFeed = ({ auth, category }) => {
  const categoryUrl = category ? `/${category}` : '';
  const channel = category || 'general';
  return (
    <ul className="app-nav">
      <li>
        <Link to={`/trending${categoryUrl}`} onlyActiveOnIndex activeClassName="active">
          <Icon name="show_chart" />
          <span className="hidden-xs">
            {' '}<FormattedMessage id="trending" defaultMessage="Trending" />
          </span>
        </Link>
      </li>
      <li>
        <Link to={`/created${categoryUrl}`} activeClassName="active">
          <Icon name="fiber_new" />
          <span className="hidden-xs">
            {' '}<FormattedMessage id="new" defaultMessage="New" />
          </span>
        </Link>
      </li>
      <li>
        <Link to={`/hot${categoryUrl}`} activeClassName="active">
          <Icon name="whatshot" />
          <span className="hidden-xs">
            {' '}<FormattedMessage id="hot" defaultMessage="Hot" />
          </span>
        </Link>
      </li>
      <li>
        <Link to={`/active${categoryUrl}`} activeClassName="active">
          <Icon name="track_changes" />
          <span className="hidden-xs">
            {' '}<FormattedMessage id="active" defaultMessage="Active" />
          </span>
        </Link>
      </li>
      {auth.isAuthenticated &&
        <li>
          <Link to={`/messages/${channel}`} activeClassName="active">
            <Icon name="chat_bubble_outline" />
            <span className="hidden-xs">
              {' '}<FormattedMessage id="chat" defaultMessage="Chat" />
            </span>
          </Link>
        </li>
      }
    </ul>
  );
};

export default MenuFeed;
