import React, { PropTypes } from 'react';
import { ConnectedRouter } from 'react-router-redux';

import routes from './routes';

import './styles/base.less';

const AppHost = ({ history }) => (
  <ConnectedRouter history={history}>
    {routes}
  </ConnectedRouter>
);

AppHost.propTypes = {
  history: PropTypes.shape().isRequired,
};

export default AppHost;
