import React from 'react';
import { Icon } from 'antd';
import './Loading.less';

const Loading = () =>
  (<div className="Loading">
    <Icon className="Loading__icon" type="loading" />
  </div>);

export default Loading;
