import puppeteer from 'puppeteer';

export const appUrl = process.env.TEST_URL || 'http://localhost:3000';

export const waitForNewPage = browser =>
  new Promise(x => browser.once('targetcreated', target => x(target.page())));

export const createBrowser = () => {
  const { DEBUG } = process.env;
  const debugOptions = {
    headless: false,
    slowMo: 100,
  };

  return puppeteer.launch(DEBUG ? debugOptions : {});
};
