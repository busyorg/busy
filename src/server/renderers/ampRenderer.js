import _ from 'lodash';
import cheerio from 'cheerio';
import Handlebars from 'handlebars';
import HandlebarsIntl from 'handlebars-intl';
import { getHtml } from '../../client/components/Story/Body';
import { dropCategory } from '../../client/helpers/postHelpers';

HandlebarsIntl.registerWith(Handlebars);

function upgradeURL(url) {
  return url.replace(/^(\/\/)|(http:\/\/)/, 'https://');
}

function cleanHTML(html) {
  const $ = cheerio.load(html);
  $('head').remove();

  // AMP requires amp-img instead of img
  $('img').each((i, elem) => {
    $(elem).replaceWith(
      `<div class="fixed-container"><amp-img class="contain" layout="fill" src="${$(elem).attr(
        'src',
      )}"></amp-img></div>`,
    );
  });

  // AMP requires amp-iframe instead of iframe
  const allowedIframeAttrs = ['src', 'frameborder', 'allowfullscreen', 'width', 'height'];
  $('iframe').each((i, elem) => {
    const el = $('<amp-iframe></amp-iframe>');
    const attribs = elem.attribs;

    Object.keys(attribs).forEach(key => {
      if (allowedIframeAttrs.includes(key)) {
        const value = key === 'src' ? upgradeURL(attribs[key]) : attribs[key];
        el.attr(key, value);
      }
    });

    el.attr('sandbox', 'allow-scripts allow-same-origin allow-presentation');
    $(el).append('<span placeholder>Loading iframe</span>');
    $(elem).replaceWith(el);
  });

  return $('body').html();
}

function getContext(post, body, appUrl) {
  const metadata = _.attempt(JSON.parse, post.json_metadata);
  let images = [];
  if (!_.isError(metadata) && metadata.image) images = metadata.image;

  const datePublished = `${post.created}Z`;
  const dateModified = `${post.last_update}Z`;
  const canonical = `${appUrl}${dropCategory(post.url)}`;

  const manifest = {
    '@context': 'http://schema.org',
    '@type': 'BlogPosting',
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Busy.org',
      logo: {
        '@type': 'ImageObject',
        url: `${appUrl}/images/logo-brand.png`,
        height: 32,
        width: 32,
      },
    },
    mainEntityOfPage: canonical,
    headline: post.title,
    datePublished,
    dateModified,
    image: images[0] || `${appUrl}/images/logo.png`,
  };

  const context = {
    manifest: JSON.stringify(manifest),
    title: post.title,
    canonical,
    datePublished,
    dateModified,
    author: post.author,
    body,
  };

  return context;
}

export function compileAmpTemplate(template) {
  return Handlebars.compile(template);
}

export default function renderAmpPage(post, appUrl, template) {
  const body = cleanHTML(getHtml(post.body, post.jsonMetadata, 'text'));
  const context = getContext(post, body, appUrl);

  return template(context, {
    data: {
      intl: {
        locales: 'en-US',
      },
    },
  });
}
