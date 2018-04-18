/* eslint-disable import/prefer-default-export */

export const waitForNewPage = browser =>
  new Promise(x => browser.once('targetcreated', target => x(target.page())));
