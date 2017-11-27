import React from 'react';
import { FormattedMessage } from 'react-intl';

export default () =>
  (<div className="main-panel">
    <div className="container text-center my-5">
      <h1>
        <FormattedMessage id="help" defaultMessage="Help" />
      </h1>
      <h2>
        <FormattedMessage id="@statics/report_issue" defaultMessage="Report an issue" />
      </h2>
      <p>
        <FormattedMessage
          id="@statics/contact_if_problem_0"
          defaultMessage="If you spot a problem with Busy, please"
        />{' '}
        <a href="mailto:contact@busy.org">
          <FormattedMessage id="@statics/contact_if_problem_1" defaultMessage="contact us" />
        </a>{' '}
        <FormattedMessage
          id="@statics/contact_if_problem_2"
          defaultMessage="or submit an issue on"
        />{' '}
        <a href="https://github.com/adcpm/busy/issues" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>.
      </p>
    </div>
  </div>);
