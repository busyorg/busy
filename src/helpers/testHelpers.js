import { jsdom } from 'jsdom';

export const makeDOMEnvironment = () => {
  global.document = jsdom('<html><header></header><body></body></html>');
  global.window = document.defaultView;
};
