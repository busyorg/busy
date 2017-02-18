
// By @kuy - https://github.com/kuy/redux-tooltip/blob/039cee1b3e8f6c7d81f56fcb0a40739016d49c19/src/utils.js
/**
 * Returns a position of given DOM element.
 *
 * @param {Object} el - DOM element.
 * @return {Object}
 */
export function getElementPosition(el) {
  const pos = el.getBoundingClientRect();
  const { pageYOffset, pageXOffset } = window;
  const { scrollTop, clientTop, scrollLeft, clientLeft } = document.documentElement;
  const winTop = (pageYOffset || scrollTop) - clientTop;
  const winLeft = (pageXOffset || scrollLeft) - clientLeft;

  return {
    top: pos.top + winTop,
    left: pos.left + winLeft,
    right: pos.right + winLeft,
    bottom: pos.bottom + winTop,
    width: pos.width,
    height: pos.height,
  };
}
