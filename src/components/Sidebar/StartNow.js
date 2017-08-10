import React from 'react';
import { Link } from 'react-router-dom';
import './StartNow.less';

const StartNow = () =>
  (<div className="StartNow">
    <h3 className="StartNow__title">Never wrote a post?</h3>
    <Link to="/write">
      <button className="StartNow__button">Start Now</button>
    </Link>
  </div>);

export default StartNow;
