import React from 'react';
import PropTypes from 'prop-types';
import { Popover } from 'antd';

const PopoverContainer = props => (
  <Popover
    {...props}
    content={
      <div>
        <div
          role="presentation"
          className="Popover__overlay"
          onClick={() => props.onVisibleChange(false)}
        />
        {props.content}
      </div>
    }
  />
);

PopoverContainer.propTypes = {
  onVisibleChange: PropTypes.func,
  content: PropTypes.node,
};

PopoverContainer.defaultProps = {
  content: null,
  onVisibleChange: () => {},
};

export default PopoverContainer;
