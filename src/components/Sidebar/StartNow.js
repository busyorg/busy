import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import './StartNow.less';

const StartNow = () =>
  (<div className="StartNow">
    <h3 className="StartNow__title">
      <FormattedMessage id="never_written_post" />
    </h3>
    <Link to="/write">
      <button className="StartNow__button">
        <FormattedMessage id="start_now" />
      </button>
    </Link>
  </div>);

export default StartNow;
