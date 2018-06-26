
import React from 'react';
import { FormattedMessage } from 'react-intl';
import './SidebarBlock.less';

const SignUp = () => (
  <div>
    <div>
      <img
        alt="Signup Img"
        className="SidebarBlock__signup-image"
        src="https://steemitimages.com/0x0/https://media.giphy.com/media/4Hgz1paOmAouZ28C7t/giphy.gif"
      />
    </div>
    <br />
    <div className="SidebarBlock">
      <h3 className="SidebarBlock__title">
        <FormattedMessage id="new_to_busy" defaultMessage="New to ULOG?" />
      </h3>
      <a target="_blank" rel="noopener noreferrer" href={process.env.SIGNUP_URL}>
        <button className="SidebarBlock__button">
          <FormattedMessage id="signup" defaultMessage="Sign up" />
        </button>
      </a>
    </div>
  </div>
);

export default SignUp;