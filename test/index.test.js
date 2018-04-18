import auth from './auth';
import search from './search';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

describe('E2E tests', () => {
  const appUrl = process.env.TEST_URL || 'http://localhost:3000';

  auth('auth', appUrl);
  search('Search', appUrl);
});
