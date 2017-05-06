import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import Icon from '../../widgets/Icon';

export default () =>
  <ul className="app-nav">
    <li>
      <Link to="/about" activeClassName="active">
        <Icon name="info_outline" />
        <span className="hidden-xs">
          {' '}<FormattedMessage id="about" defaultMessage="About" />
        </span>
      </Link>
    </li>
    <li>
      <Link to="/team" activeClassName="active">
        <Icon name="group_work" />
        <span className="hidden-xs">
          {' '}<FormattedMessage id="team" defaultMessage="Team" />
        </span>
      </Link>
    </li>
    <li>
      <Link to="/donors" activeClassName="active">
        <Icon name="favorite" />
        <span className="hidden-xs">
          {' '}<FormattedMessage id="donors" defaultMessage="Donors" />
        </span>
      </Link>
    </li>
    <li>
      <Link to="/help" activeClassName="active">
        <Icon name="help_outline" />
        <span className="hidden-xs">
          {' '}<FormattedMessage id="help" defaultMessage="Help" />
        </span>
      </Link>
    </li>
  </ul>;
