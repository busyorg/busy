import puppeteer from 'puppeteer';

import { waitForNewPage } from './utils';

export default function auth(suiteName, appUrl) {
  describe(suiteName, () => {
    let browser;
    beforeAll(async () => {
      browser = await puppeteer.launch({
        headless: false,
      });
    });

    it('should redirect to sign up page', async () => {
      const page = await browser.newPage();
      await page.goto(appUrl);

      await page.waitForSelector('[data-testid="signupLink"]');
      await page.click('[data-testid="signupLink"]');

      const newPage = await waitForNewPage(browser);

      const newPageUrl = newPage.url();
      expect(newPageUrl).toEqual('https://signup.steemit.com/?ref=busy');

      await newPage.close();
      await page.close();
    });

    it('should redirect to login page', async () => {
      const page = await browser.newPage();
      await page.goto(appUrl);

      await page.waitForSelector('[data-testid="loginLink"]');
      await page.click('[data-testid="loginLink"]');

      const currentUrl = page.url();
      expect(currentUrl).toEqual(
        'https://steemconnect.com/oauth2/authorize?client_id=busy.app&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&scope=',
      );

      await page.close();
    });

    afterAll(async () => {
      browser.close();
    });
  });
}
