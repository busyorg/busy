import React from 'react';
import { ConnectedRouter } from 'react-router-redux';

import routes from './routes';

// load the stylesheet
import './styles/base.less';

const AppHost = ({ history }) => (
  <ConnectedRouter history={history}>
    {routes}
  </ConnectedRouter>
);

export default AppHost;
