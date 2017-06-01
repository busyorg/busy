import React from 'react';
import './StartNow.less';

const StartNow = () =>
  <div className="StartNow">
    <h3 className="StartNow__title">Never wrote a post?</h3>
    <button
      className="StartNow__button"
      onClick={() => {
        console.log('onClick button TODO link to write page');
      }}
    >Start Now</button>
  </div>;

StartNow.propTypes = {};

export default StartNow;
