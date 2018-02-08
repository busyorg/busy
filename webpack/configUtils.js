/**
 * Create a regular expression matcher for filename extensions.
 */
const createFnExtMatcher = (...fileExtensions) => {
  if (typeof fileExtensions !== 'object' || !Array.isArray(fileExtensions)) {
    throw new Error('`fileExtensions` is not an array');
  }

  const matcher = new RegExp(`\.(${ fileExtensions.join('|') })$`, 'i');
  return matcher;
}
  
module.exports.createFnExtMatcher = createFnExtMatcher;

const MATCH_CSS_LESS = createFnExtMatcher('css', 'less');
const MATCH_JS_JSX = createFnExtMatcher('js', 'jsx');

exports.MATCH_CSS_LESS = MATCH_CSS_LESS;
exports.MATCH_JS_JSX = MATCH_JS_JSX;

