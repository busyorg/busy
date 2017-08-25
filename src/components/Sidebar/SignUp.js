import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import './SignUp.less';

const SignUp = () =>
  (<div className="SignUp">
    <h3 className="SignUp__title">
      <FormattedMessage id="new_to_busy" defaultMessage="New to Busy?" />
    </h3>
    <Link to="/signup">
      <button className="SignUp__button">
        <FormattedMessage id="signup" defaultMessage="Sign up" />
      </button>
    </Link>
  </div>);

export default SignUp;
