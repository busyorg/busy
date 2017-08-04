import React from 'react';
import { Link } from 'react-router-dom';
import './SignUp.less';

const SignUp = () =>
  (<div className="SignUp">
    <h3 className="SignUp__title">New to Busy?</h3>
    <Link to="/signup">
      <button className="SignUp__button">Sign up</button>
    </Link>
  </div>);

export default SignUp;
