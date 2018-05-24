import React from 'react';
import { FormattedMessage } from 'react-intl';
import './FetchFailed.less';

const FetchFailed = () => (
  <div className="FetchFailed">
    <i className="FetchFailed__icon iconfont icon-warning" />
    <div>
      <FormattedMessage
        id="error_fetch_failed"
        defaultMessage="We couldn't load this feed contents. Check your connection and try again"
      />
    </div>
  </div>
);

export default FetchFailed;
