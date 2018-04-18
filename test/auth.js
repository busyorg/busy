import puppeteer from 'puppeteer';

export default function auth(suiteName, appUrl) {
  describe(suiteName, () => {
    let browser;
    beforeAll(async () => {
      browser = await puppeteer.launch({
        headless: false,
      });
    });

    it('should load the page', async () => {
      const page = await browser.newPage();
      await page.goto(appUrl);

      const el = await page.$eval('.Topnav__brand', e => e.innerText);
      expect(el).toEqual('busy');

      await page.close();
    });

    afterAll(async () => {
      browser.close();
    });
  });
}
