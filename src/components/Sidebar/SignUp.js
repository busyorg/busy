import React from 'react';
import { FormattedMessage } from 'react-intl';
import './SignUp.less';

const SignUp = () =>
  (<div className="SignUp">
    <h3 className="SignUp__title">
      <FormattedMessage id="new_to_busy" defaultMessage="New to Busy?" />
    </h3>
    <a target="_blank" rel="noopener noreferrer" href="https://steemit.com/pick_account">
      <button className="SignUp__button">
        <FormattedMessage id="signup" defaultMessage="Sign up" />
      </button>
    </a>
  </div>);

export default SignUp;
