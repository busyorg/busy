import React from 'react';
import { Button } from 'antd';

const StartNow = () =>
  <div className="rounded bg-primary text-center text-white p-4">
    <h3>Never wrote a post?</h3>
    <Button
      ghost
      type="primary"
      size="large"
      onClick={() => {
        console.log('onClick button TODO link to write page');
      }}
    >Start Now</Button>
  </div>;

StartNow.propTypes = {};

export default StartNow;
