import { createBrowser, waitForNewPage, appUrl } from './utils';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

describe('auth', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await createBrowser();
  });

  beforeEach(async () => {
    page = await browser.newPage();
  });

  it('should redirect to sign up page', async () => {
    await page.goto(appUrl);

    await page.waitForSelector('[data-testid="signupLink"]');
    await page.click('[data-testid="signupLink"]');

    const newPage = await waitForNewPage(browser);

    const newPageUrl = newPage.url();
    expect(newPageUrl).toEqual('https://signup.steemit.com/?ref=busy');

    await newPage.close();
  });

  it('should redirect to login page', async () => {
    await page.goto(appUrl);

    await page.waitForSelector('[data-testid="loginLink"]');
    await page.click('[data-testid="loginLink"]');

    const currentUrl = page.url();
    expect(currentUrl).toEqual(
      'https://steemconnect.com/oauth2/authorize?client_id=busy.app&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&scope=',
    );
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    browser.close();
  });
});
