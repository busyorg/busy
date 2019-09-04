import omit from 'lodash/omit';
import SteemConnect from '../steemConnectAPI';
import { USER_METADATA_KEY } from './constants';

const initialSetting = {
  locale: 'auto',
  votingPower: 'on',
  votePercent: 10000,
  showNSFWPosts: false,
  nightmode: false,
  rewriteLinks: false,
  loading: false,
  exitPageSetting: true,
  rewardSetting: 50,
  useBeta: false,
};

// sc2 metadata support discontinuation preparation
// const getMetadata = () => SteemConnect.me().then(resp => resp.user_metadata);
// note that using Promise in some place is just to provide backward compatibility to old codes. refactoring is needed later.
export const getMetadata = () => {
  let localMetadata = JSON.parse(localStorage.getItem(USER_METADATA_KEY));
  if (localMetadata) {
    return Promise.resolve(localMetadata);
  }

  let promise; // due to lint error
  SteemConnect.me().then(resp => {
    try {
      if (resp.user_metadata) {
        localStorage.setItem(USER_METADATA_KEY, JSON.stringify(resp.user_metadata));
        promise = resp.user_metadata;
      } else {
        localMetadata = {
          settings: initialSetting,
        };
        localStorage.setItem(USER_METADATA_KEY, JSON.stringify(localMetadata));
        promise = Promise.resolve(localMetadata);
      }
    } catch (err) {
      promise = Promise.reject(new Error(err));
    }
  });

  return promise;
};

export const updateUserMetadata = metadata => {
  localStorage.setItem(USER_METADATA_KEY, JSON.stringify(metadata));
  return Promise.resolve(metadata);
};

export const saveSettingsMetadata = settings =>
  getMetadata()
    .then(metadata =>
      updateUserMetadata({
        ...metadata,
        settings: {
          ...metadata.settings,
          ...settings,
        },
      }),
    )
    .then(resp => resp.settings);

export const addDraftMetadata = draft =>
  getMetadata()
    .then(metadata =>
      updateUserMetadata({
        ...metadata,
        drafts: {
          ...metadata.drafts,
          [draft.id]: draft.postData,
        },
      }),
    )
    .then(resp => resp.drafts[draft.id]);

export const deleteDraftMetadata = draftIds =>
  getMetadata()
    .then(metadata =>
      updateUserMetadata({
        ...metadata,
        drafts: omit(metadata.drafts, draftIds),
      }),
    )
    .then(resp => resp.drafts);

export const toggleBookmarkMetadata = (id, author, permlink) =>
  getMetadata()
    .then(metadata =>
      updateUserMetadata({
        ...metadata,
        bookmarks:
          metadata.bookmarks && metadata.bookmarks[id]
            ? omit(metadata.bookmarks, id)
            : { ...metadata.bookmarks, [id]: { id, author, permlink } },
      }),
    )
    .then(resp => resp.bookmarks);

export const saveNotificationsLastTimestamp = lastTimestamp =>
  getMetadata()
    .then(metadata =>
      updateUserMetadata({
        ...metadata,
        notifications_last_timestamp: lastTimestamp,
      }),
    )
    .then(resp => resp.notifications_last_timestamp);

export default getMetadata;
