import React from "react";
import steemconnect from "sc2-sdk";
import { FormattedMessage } from "react-intl";
import "./Hero.less";

const Hero = () =>
  <div className="Hero">
    <div className="container container-small">
      <h1 className="hero-message">
        <FormattedMessage
          id="hero"
          defaultMessage="Ensuring compensation for the creators of value"
        />
      </h1>
      <button className="ant-btn-lg hero-signup">
        <FormattedMessage id="signup" defaultMessage="Sign Up" />
      </button>
    </div>
  </div>;

export default Hero;
