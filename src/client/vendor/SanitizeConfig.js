/**
This function is extracted from steemit.com source code and does the same tasks with some slight-
 * adjustments to meet our needs. Refer to the main one in case of future problems:
 * https://raw.githubusercontent.com/steemit/steemit.com/354c08a10cf88e0828a70dbf7ed9082698aea20d/app/utils/SanitizeConfig.js
 *
 */
const iframeWhitelist = [
  {
    re: /^(https?:)?\/\/player.vimeo.com\/video\/.*/i,
    fn: src => {
      // <iframe src="https://player.vimeo.com/video/179213493" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
      if (!src) return null;
      const m = src.match(/https:\/\/player\.vimeo\.com\/video\/([0-9]+)/);
      if (!m || m.length !== 2) return null;
      return `https://player.vimeo.com/video/${m[1]}`;
    },
  },
  {
    re: /^(https?:)?\/\/www.youtube.com\/embed\/.*/i,
    fn: src => src.replace(/\?.+$/, ''), // strip query string (yt: autoplay=1,controls=0,showinfo=0, etc)
  },
  {
    re: /^(https?:)?\/\/w.soundcloud.com\/player\/.*/i,
    fn: src => {
      if (!src) return null;
      // <iframe width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/257659076&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>
      const m = src.match(/url=(.+?)[&?]/);
      if (!m || m.length !== 2) return null;
      return (
        `https://w.soundcloud.com/player/?url=${
          m[1]
        }&auto_play=false&hide_related=false&show_comments=true` +
        '&show_user=true&show_reposts=false&visual=true'
      );
    },
  },
  {
    re: /^(https?:)?\/\/(?:www\.)?(?:periscope.tv\/)(.*)?$/i,
    fn: src => src, // handled by embedjs
  },
  {
    re: /^(https?:)?\/\/(?:www\.)?(?:(player.)?twitch.tv\/)(.*)?$/i,
    fn: src => src, // handled by embedjs
  },
];
export const noImageText = '(Image not shown due to low ratings)';
export const allowedTags = `
    div, iframe, del,
    a, p, b, q, br, ul, li, ol, img, h1, h2, h3, h4, h5, h6, hr,
    blockquote, pre, code, em, strong, center, table, thead, tbody, tr, th, td,
    strike, sup, sub
`
  .trim()
  .split(/,\s*/);

// Medium insert plugin uses: div, figure, figcaption, iframe
export default ({ large = true, noImage = false, sanitizeErrors = [] }) => ({
  allowedTags,
  // figure, figcaption,

  // SEE https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
  allowedAttributes: {
    // "src" MUST pass a whitelist (below)
    iframe: [
      'src',
      'width',
      'height',
      'frameborder',
      'allowfullscreen',
      'webkitallowfullscreen',
      'mozallowfullscreen',
    ],

    // class attribute is strictly whitelisted (below)
    div: ['class'],

    // style is subject to attack, filtering more below
    td: ['style'],
    img: ['src', 'alt'],
    a: ['href', 'rel', 'target'],
  },
  transformTags: {
    iframe: (tagName, attribs) => {
      const srcAtty = decodeURIComponent(attribs.src);
      for (const item of iframeWhitelist) {
        if (item.re.test(srcAtty)) {
          const src = typeof item.fn === 'function' ? item.fn(srcAtty, item.re) : srcAtty;
          if (!src) break;
          return {
            tagName: 'iframe',
            attribs: {
              frameborder: '0',
              allowfullscreen: 'allowfullscreen',
              webkitallowfullscreen: 'webkitallowfullscreen', // deprecated but required for vimeo : https://vimeo.com/forums/help/topic:278181
              mozallowfullscreen: 'mozallowfullscreen', // deprecated but required for vimeo
              src,
              width: large ? '640' : '480',
              height: large ? '360' : '270',
            },
          };
        }
      }
      console.log('Blocked, did not match iframe "src" white list urls:', tagName, attribs);
      sanitizeErrors.push(`Invalid iframe URL: ${srcAtty}`);
      return { tagName: 'div', text: `(Unsupported ${srcAtty})` };
    },
    img: (tagName, attribs) => {
      if (noImage) return { tagName: 'div', text: noImageText };
      // See https://github.com/punkave/sanitize-html/issues/117
      let { src, alt } = attribs;
      if (!/^(https?:)?\/\//i.test(src)) {
        console.log('Blocked, image tag src does not appear to be a url', tagName, attribs);
        sanitizeErrors.push('An image in this post did not save properly.');
        return { tagName: 'img', attribs: { src: 'brokenimg.jpg' } };
      }

      // replace http:// with // to force https when needed
      src = src.replace(/^http:\/\//i, '//');

      const atts = { src };
      if (alt && alt !== '') atts.alt = alt;
      return { tagName, attribs: atts };
    },
    div: (tagName, attribs) => {
      const attys = {};
      const classWhitelist = [
        'pull-right',
        'pull-left',
        'text-justify',
        'text-rtl',
        'text-center',
        'text-right',
        'videoWrapper',
      ];
      const validClass = classWhitelist.find(e => attribs.class === e);
      if (validClass) {
        attys.class = validClass;
      }
      return {
        tagName,
        attribs: attys,
      };
    },
    td: (tagName, attribs) => {
      const attys = {};
      if (attribs.style === 'text-align:right') {
        attys.style = 'text-align:right';
      }
      return {
        tagName,
        attribs: attys,
      };
    },
    a: (tagName, attribs) => {
      let { href } = attribs;
      if (!href) href = '#';
      href = href.trim();
      const attys = { href };
      if (!href.match(/^^(\/|https:\/\/(staging\.)?busy\.org(?![\w\.]+))/)) {
        attys.target = '_blank'; // pending iframe impl https://mathiasbynens.github.io/rel-noopener/
        attys.rel = 'nofollow noopener';
      }
      return {
        tagName,
        attribs: attys,
      };
    },
  },
});
