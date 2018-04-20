import faker from 'faker';
import { createBrowser, appUrl } from './utils';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

describe('search', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await createBrowser();
  });

  beforeEach(async () => {
    page = await browser.newPage();
  });

  it('should navigate to search page', async () => {
    const searchTerm = faker.random.words();

    await page.goto(appUrl);

    await page.waitForSelector('[data-testid="searchInput"]');
    const input = await page.$('[data-testid="searchInput"]');

    await input.click();
    await input.type(searchTerm);
    await input.press('Enter');

    const currentUrl = page.url();
    expect(currentUrl).toEqual(`${appUrl}/search?q=${encodeURI(searchTerm)}`);

    const content = await page.content();
    expect(content).toContain('Search results');
  });

  it('should have link to search results', async () => {
    const searchTerm = faker.random.words();

    await page.goto(appUrl);

    await page.waitForSelector('[data-testid="searchInput"]');

    const input = await page.$('[data-testid="searchInput"]');

    await input.click();
    await input.type(searchTerm);

    await page.waitForSelector('[data-testid="searchAllResultsLink"]');
    await page.click('[data-testid="searchAllResultsLink"]');

    const currentUrl = page.url();
    expect(currentUrl).toEqual(`${appUrl}/search?q=${encodeURI(searchTerm)}`);

    const content = await page.content();
    expect(content).toContain('Search results');
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    browser.close();
  });
});
