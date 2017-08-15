// Simplified version of https://github.com/beijaflor-io/react-responsive-utils
import matchMediaModule from 'matchmedia';
import {
  MEDIA_CHANGED,
  MEDIA_MOUNTED,
  reducer as responsiveReducer,
  mediaQueryTracker,
} from './responsive/redux-mediaquery';

export { MEDIA_CHANGED };
export { MEDIA_MOUNTED };

let matchMedia;
if (!process.env.IS_BROWSER) {
  matchMedia = function server$matchMedia() {
    return {
      matches: false,
    };
  };
} else {
  matchMedia = matchMediaModule;
}
global.matchMedia = matchMediaModule;

export { matchMedia };
export { responsiveReducer };

// TODO - Review these with the app breakpoints
export const large = '(min-width: 64.063em)';
export const medium = '(min-width: 992px)';
export const small = '(max-width: 992px)';

export function isSmall() {
  return matchMedia(small).matches && !matchMedia(medium).matches;
}

export function isMedium() {
  return matchMedia(medium).matches && !matchMedia(large).matches;
}

export function isLarge() {
  return matchMedia(large).matches;
}

export function mountResponsive(store) {
  if (process.env.IS_BROWSER) {
    const tracker = mediaQueryTracker({
      isSmall: small,
      isMedium: medium,
      isLarge: large,
      innerWidth: true,
      innerHeight: true,
    });

    const dispatch = store.dispatch.bind(store);
    store.dispatch(() => tracker(dispatch));
  }
}
