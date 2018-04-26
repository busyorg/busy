import { createBrowser, waitForNewPage, appUrl } from './utils';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

describe('auth', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await createBrowser();
  });

  beforeEach(async () => {
    page = await browser.newPage();
  });

  test('sign up', async () => {
    await page.goto(appUrl);

    await page.waitForSelector('[data-testid="signupLink"]');
    await page.click('[data-testid="signupLink"]');

    const newPage = await waitForNewPage(browser);

    const newPageUrl = newPage.url();
    expect(newPageUrl).toEqual('https://signup.steemit.com/?ref=busy');

    await newPage.close();
  });

  test('login', async () => {
    await page.goto(appUrl);

    await page.waitForSelector('[data-testid="loginLink"]');
    await page.click('[data-testid="loginLink"]');

    const currentUrl = page.url();
    expect(currentUrl).toEqual(
      'https://steemconnect.com/oauth2/authorize?client_id=busy.app&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&scope=',
    );
  });

  test('writing a post', async () => {
    await page.setCookie({
      name: 'access_token',
      domain: 'localhost',
      value: 'TOKEN',
    });

    await page.goto(appUrl);

    await page.waitForSelector('[data-testid="writeLink"]');
    await page.click('[data-testid="writeLink"]');

    const currentUrl = page.url();
    expect(currentUrl).toBe(`${appUrl}/editor`);

    await page.waitForSelector('[data-testid="editorButtonSubmit"]');

    const titleInput = await page.$('[data-testid="editorInputTitle"]');
    const tagsInput = await page.$('#topics');
    const bodyInput = await page.$('[data-testid="editorInputBody"]');

    await titleInput.click();
    await titleInput.type('Hello World');

    await tagsInput.click();
    await tagsInput.type('test');

    await bodyInput.click();
    await bodyInput.type('Hey!');

    await page.click('[data-testid="editorButtonSubmit"]');

    await page.waitForSelector('[data-testid="storyFullTitle"]');
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    browser.close();
  });
});
