/* eslint-disable no-useless-escape, max-len,no-param-reassign */
import { validateAccountName } from './ChainValidation';

export function escapeRegExp(str) {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}

export function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

export const imageRegex = /https?:\/\/(?:[-a-zA-Z0-9._]*[-a-zA-Z0-9])(?::\d{2,5})?(?:[/?#](?:[^\s"'<>\][()]*[^\s"'<>\][().,])?(?:(?:\.(?:tiff?|jpe?g|gif|png|svg|ico)|ipfs\/[a-z\d]{40,})))/ig;

export function linkify(content) {
  // hashtag
  content = content.replace(/(^|\s)(#[-a-z\d]+)/ig, (tag) => {
    if (/#[\d]+$/.test(tag)) return tag; // Don't allow numbers to be tags
    const space = /^\s/.test(tag) ? tag[0] : '';
    const tag2 = tag.trim().substring(1);
    const tagLower = tag2.toLowerCase();
    return `${space}<a href="/trending/${tagLower}">${tag}</a>`;
  });

  // usertag (mention)
  content = content.replace(/(^|\s)(@[a-z][-\.a-z\d]+[a-z\d])/ig, (user) => {
    const space = /^\s/.test(user) ? user[0] : '';
    const user2 = user.trim().substring(1);
    const userLower = user2.toLowerCase();
    const valid = validateAccountName(userLower) == null;
    return space + (valid ?
      `<a href="/@${userLower}">@${user2}</a>` :
      `@${user2}`
    );
  });

  // content = content.replace(linksRe.any, (ln) => {
  //   if (linksRe.image.test(ln)) {
  //     if (images) images.add(ln);
  //     return `<img src="${ipfsPrefix(ln)}" />`;
  //   }
  //   if (links) links.add(ln);
  //   return `<a href="${ipfsPrefix(ln)}">${ln}</a>`;
  // });
  return content;
}
