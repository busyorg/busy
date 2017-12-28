import React from 'react';
import { FormattedMessage } from 'react-intl';
import team from '../helpers/team';
import advisors from '../helpers/advisors';
import contributors from '../helpers/contributors';

export default () => (
  <div className="main-panel">
    <div className="container text-center my-5">
      <h1>
        <FormattedMessage id="team" defaultMessage="Team" />
      </h1>
      <p>
        <FormattedMessage
          id="@statics/busy_team"
          defaultMessage="The Busy team draws on years of experience across multiple successful startup projects and helps guide the foundation towards its strategic goals."
        />
      </p>
      <div className="row my-5">
        {team.map(user => (
          <div>
            {user.name} - {user.role}
          </div>
        ))}
      </div>
      <h1>
        <FormattedMessage id="advisors" defaultMessage="Advisors" />
      </h1>
      <div className="row my-5">{advisors.map(user => <div>{user.name}</div>)}</div>
      <h1>
        <FormattedMessage id="contributors" defaultMessage="Contributors" />
      </h1>
      <div className="row my-5">{contributors.map(user => <div>{user.name}</div>)}</div>
    </div>
  </div>
);
