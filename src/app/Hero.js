import React from 'react';
import steemconnect from 'steemconnect';
import { FormattedMessage } from 'react-intl';
import './Hero.scss';

const Hero = () =>
  <div className="Hero">
    <div className="container container-small my-5 text-center">
      <h1>
        <FormattedMessage
          id="hero"
          defaultMessage="Ensuring compensation for the creators of value"
        />
      </h1>
      <a
        className="btn btn-success"
        href="https://steemit.com/enter_email"
        target="_blank"
      >
        <FormattedMessage id="signup" defaultMessage="Sign Up" />
      </a>
      {' or '}
      <a href={steemconnect.getLoginURL()}>
        <FormattedMessage id="login" defaultMessage="Log In" />
      </a>
    </div>
  </div>;

export default Hero;
