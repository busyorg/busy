import React from 'react';
import { FormattedMessage } from 'react-intl';
import Header from '../app/Header';

const Help = () =>
  <div className="main-panel">
    <Header />
    <div className="container text-center my-5">
      <h1><FormattedMessage id="help" /></h1>
      <h2>Report an issue</h2>
      <p>
        If you spot a problem with Busy, please
        {' '}<a href="mailto:">contact us</a> or submit an issue on{' '}
        <a
          href="https://github.com/adcpm/busy/issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>.
      </p>
    </div>
  </div>;

export default Help;
