import { Helmet } from 'react-helmet';

export default function renderSsrPage(store, html, template, noindex) {
  const preloadedState = store.getState();
  const helmet = Helmet.renderStatic();
  const header =
    helmet.meta.toString() + helmet.title.toString() + helmet.link.toString() + noindex
      ? '<meta name="robots" content="noindex, nofollow">'
      : '';
  return template
    .replace('<!--server:header-->', header)
    .replace('<!--server:html-->', html)
    .replace(
      '<!--server:scripts-->',
      `<script>
        // WARNING: See the following for security issues around embedding JSON in HTML:
        // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
        window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
    </script>`,
    );
}
