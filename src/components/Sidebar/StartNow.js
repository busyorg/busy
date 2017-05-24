import React from 'react';

const StartNow = () =>
  <div className="rounded bg-primary text-center text-white p-4">
    <h3>Never wrote a post?</h3>
    <button
      className="btn btn-outline-white"
      onClick={() => {
        console.log('onClick button TODO link to write page');
      }}
    >Start Now</button>
  </div>;

StartNow.propTypes = {};

export default StartNow;
