import { Helmet } from 'react-helmet';

export default function renderSsrPage(store, html, template, noindex) {
  const preloadedState = store.getState();
  const helmet = Helmet.renderStatic();
  const header = noindex
    ? helmet.meta.toString() + helmet.title.toString() + helmet.link.toString()
    : helmet.meta.toString() + helmet.title.toString() + helmet.link.toString();
  return template
    .replace('<!--server:header-->', header)
    .replace('<!--server:html-->', html)
    .replace(
      '<!--server:scripts-->',
      `<script>
        // WARNING: See the following for security issues around embedding JSON in HTML:
        // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
        window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)
          .replace(/\u2028/g, '\\n')
          .replace(/</g, '\\u003c')}
    </script>`,
    );
}
