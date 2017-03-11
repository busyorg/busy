/* global window, document */

export function getTopPosition() {
  return (window.pageYOffset !== undefined)
    ? window.pageYOffset
    : (document.documentElement || document.body.parentNode || document.body).scrollTop;
}

export function setTopPosition(y) {
  document.body.scrollTop = y;
  // Firefox Compatibility while document.scrollingElement isn't available
  document.documentElement.scrollTop = y;
}

export function getViewportHeight() {
  return document.documentElement.scrollHeight || document.body.scrollHeight;
}
