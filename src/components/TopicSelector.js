import React from 'react';
import Topic from './Button/Topic';
import './TopicSelector.less';

const TopicSelector = () =>
  <div className="TopicSelector">
    <div className="TopicSelector__topics">
      <Topic name="photography" />
    </div>
    <div className="TopicSelector__sort">
      Sort
    </div>
  </div>

export default TopicSelector;
