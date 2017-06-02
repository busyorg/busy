import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import routes from './routes';

// load the stylesheet
import './styles/base.less';

const AppHost = () => (
  <BrowserRouter>
    {routes}
  </BrowserRouter>
);

export default AppHost;
