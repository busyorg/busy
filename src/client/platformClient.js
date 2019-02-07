/* globals window */
import createClient from './busy-sdk';

let windowObj = {};

if (typeof window !== 'undefined') {
  windowObj = window.parent;
}

export default createClient(windowObj, ['http://localhost:3110']);
