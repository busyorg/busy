import puppeteer from 'puppeteer';
import faker from 'faker';

export default function(suiteName, appUrl) {
  describe(suiteName, () => {
    let browser;
    beforeAll(async () => {
      browser = await puppeteer.launch({
        headless: false,
      });
    });

    it('should navigate to search page', async () => {
      const searchTerm = faker.random.words();

      const page = await browser.newPage();
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

      await page.close();
    });

    it('should have link to search results', async () => {
      const searchTerm = faker.random.words();

      const page = await browser.newPage();
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

      await page.close();
    });

    afterAll(async () => {
      browser.close();
    });
  });
}
