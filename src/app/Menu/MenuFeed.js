import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import Icon from '../../widgets/Icon';

const MenuFeed = ({ category }) => {
  const categoryUrl = category ? `/${category}` : '';
  const channel = category ? category : 'general';
  return (
    <ul className="app-nav">
      <li>
        <Link to={`/trending${categoryUrl}`} onlyActiveOnIndex activeClassName="active">
          <Icon name="show_chart" />
          <span className="hidden-xs">
            { ' ' }<FormattedMessage id="trending" />
          </span>
        </Link>
      </li>
      <li>
        <Link to={`/created${categoryUrl}`} activeClassName="active">
          <Icon name="fiber_new" />
          <span className="hidden-xs">
            { ' ' }<FormattedMessage id="new" />
          </span>
        </Link>
      </li>
      <li>
        <Link to={`/hot${categoryUrl}`} activeClassName="active">
          <Icon name="whatshot" />
          <span className="hidden-xs">
            { ' ' }<FormattedMessage id="hot" />
          </span>
        </Link>
      </li>
      <li>
        <Link to={`/active${categoryUrl}`} activeClassName="active">
          <Icon name="track_changes" />
          <span className="hidden-xs">
            { ' ' }<FormattedMessage id="active" />
          </span>
        </Link>
      </li>
      <li>
        <Link to={`/messages/${channel}`} activeClassName="active">
          <Icon name="chat_bubble_outline" />
          <span className="hidden-xs">
            { ' ' }<FormattedMessage id="chat" />
          </span>
        </Link>
      </li>
    </ul>
  );
};

export default MenuFeed;
