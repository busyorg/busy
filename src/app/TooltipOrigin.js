import React from 'react';
import { Origin } from 'redux-tooltip';

const TooltipOrigin = ({ children, content, active }) => {
  if (active) {
    return (
      <Origin
        content={content}
        delay={500}
        delayOn="show"
      >
        { children }
      </Origin>
    );
  }

  return children;
};

export default TooltipOrigin;
