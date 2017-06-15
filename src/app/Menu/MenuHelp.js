import React from 'react';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Icon from '../../widgets/Icon';

export default () =>
  <ul className="app-nav">
    <li>
      <NavLink to="/about" activeClassName="active">
        <Icon name="info_outline" />
        <span className="hidden-xs">
          {' '}<FormattedMessage id="about" defaultMessage="About" />
        </span>
      </NavLink>
    </li>
    <li>
      <NavLink to="/team" activeClassName="active">
        <Icon name="group_work" />
        <span className="hidden-xs">
          {' '}<FormattedMessage id="team" defaultMessage="Team" />
        </span>
      </NavLink>
    </li>
    <li>
      <NavLink to="/donors" activeClassName="active">
        <Icon name="favorite" />
        <span className="hidden-xs">
          {' '}<FormattedMessage id="donors" defaultMessage="Donors" />
        </span>
      </NavLink>
    </li>
    <li>
      <NavLink to="/help" activeClassName="active">
        <Icon name="help_outline" />
        <span className="hidden-xs">
          {' '}<FormattedMessage id="help" defaultMessage="Help" />
        </span>
      </NavLink>
    </li>
  </ul>;
