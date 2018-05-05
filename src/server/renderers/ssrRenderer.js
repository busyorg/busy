import { Helmet } from 'react-helmet';

export default function renderSsrPage(store, html, assets, template, noindex) {
  const preloadedState = store.getState();

  const helmet = Helmet.renderStatic();
  const baseHelmet = helmet.meta.toString() + helmet.title.toString() + helmet.link.toString();

  let header = baseHelmet;
  if (noindex) header += `<meta name="robots" content="noindex, nofollow">`;
  header += `<link rel="stylesheet" href="${assets.vendor.css}" />`;
  header += `<link rel="stylesheet" href="${assets.main.css}" />`;

  let scripts = `<script>window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)
    .replace(/\u2028/g, '\\n')
    .replace(/</g, '\\u003c')}</script>`;

  scripts += `<script src="${assets.vendor.js}" defer></script>`;
  scripts += `<script src="${assets.main.js}" defer></script>`;

  const production = process.env.NODE_ENV === 'production';

  return template({
    header,
    html,
    scripts,
    production,
  });
}
