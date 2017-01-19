import React from 'react';
import { Origin } from 'redux-tooltip';

const TooltipOrigin = ({ children, content, active, store }) => {
  if (active) {
    return (
      <Origin
        content={content}
        delay={500}
        delayOn="show"
        store={store}
      >
        { children }
      </Origin>
    );
  }

  return children;
};

export default TooltipOrigin;
