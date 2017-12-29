import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import donors from '../helpers/donors';

const Donors = () => (
  <div className="main-panel">
    <div className="container text-center my-5">
      <h1>
        <FormattedMessage id="donors" defaultMessage="Donors" />
      </h1>
      <p>
        <FormattedMessage
          id="@statics/our_donors"
          defaultMessage="As a non-profit organization, what would we be without you? Through the on-going support of our donors, Busy will keep evolving"
        />
        .
      </p>
      <Link className="btn btn-primary my-4" to="/transfer?to=busy.org">
        <FormattedMessage id="donate" defaultMessage="Donate" />
      </Link>
      <div className="row my-5">{Object.keys(donors).map(user => <div>{user}</div>)}</div>
    </div>
  </div>
);

export default Donors;
