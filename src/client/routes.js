import React from 'react';

import { Switch } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import routes from '../common/routes';

export default <Switch onUpdate={() => window.scrollTo(0, 0)}>{renderRoutes(routes)}</Switch>;
