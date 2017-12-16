import _ from 'lodash';
import cheerio from 'cheerio';
import Handlebars from 'handlebars';
import HandlebarsIntl from 'handlebars-intl';
import { getHtml } from '../../client/components/Story/Body';

HandlebarsIntl.registerWith(Handlebars);

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

  return $('body').html();
}

function getContext(post, body) {
  const metadata = _.attempt(JSON.parse, post.json_metadata);
  let images = [];
  if (!_.isError(metadata)) images = metadata.image;

  const datePublished = `${post.created}Z`;
  const dateModified = `${post.last_update}Z`;


  const manifest = {
    '@context': 'http://schema.org',
    '@type': 'BlogPosting',
    author: {
      '@type': 'Person',
      name: post.author,
    },
    headline: post.title,
    datePublished,
    dateModified,
    image: images[0] || '/images/logo.png',
  };

  const context = {
    manifest: JSON.stringify(manifest),
    title: post.title,
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

export default function renderAmpPage(post, template) {
  const body = cleanHTML(getHtml(post.body, post.jsonMetadata, 'text'));
  const context = getContext(post, body);

  return template(context, {
    data: {
      intl: {
        locales: 'en-US',
      },
    },
  });
}
