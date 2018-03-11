import React from 'react';

import createBrowserHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';
import { Switch } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import routes from '../common/routes';

const history = typeof window === 'undefined' ? createMemoryHistory() : createBrowserHistory();

if (typeof window !== 'undefined' && window.analytics) {
  window.analytics.page({ url: history.location.pathname });
  history.listen(location => {
    window.analytics.page({ url: location.pathname });
  });
}

export { history };
export default <Switch onUpdate={() => window.scrollTo(0, 0)}>{renderRoutes(routes)}</Switch>;
