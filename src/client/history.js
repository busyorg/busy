import createBrowserHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';

const history = typeof window === 'undefined' ? createMemoryHistory() : createBrowserHistory();

if (typeof window !== 'undefined' && window.analytics) {
  window.analytics.page({ url: history.location.pathname });
  history.listen(location => {
    window.analytics.page({ url: location.pathname });
  });
}

export default history;
