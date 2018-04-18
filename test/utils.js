import puppeteer from 'puppeteer';

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
