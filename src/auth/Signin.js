import React, { PureComponent } from 'react';
import steemconnect from 'sc2-sdk';

export default class Signin extends PureComponent {
  constructor(props) {
    super(props);
    window.location = steemconnect.getLoginURL();
  }
  render() {
    return <div />;
  }
}
