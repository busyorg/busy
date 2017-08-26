import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import './SidebarBlock.less';

const SignUp = () =>
  (<div className="SidebarBlock">
    <h3 className="SidebarBlock__title">
      <FormattedMessage id="new_to_busy" defaultMessage="New to Busy?" />
    </h3>
    <Link to="#signup">
      <button className="SidebarBlock__button">
        <FormattedMessage id="signup" defaultMessage="Sign up" />
      </button>
    </Link>
  </div>);

export default SignUp;
