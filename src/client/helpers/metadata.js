import omit from 'lodash/omit';
import SteemConnect from '../steemConnectAPI';

// sc2 metadata support discontinuation preparation
// const getMetadata = () => SteemConnect.me().then(resp => resp.user_metadata);
export const getMetadata = () =>
  SteemConnect.me().then(resp => {
    const localMetadata = JSON.parse(localStorage.getItem('user_metadata'));
    if (localMetadata) {
      return Promise.resolve(localMetadata);
    }

    try {
      localStorage.setItem('user_metadata', JSON.stringify(resp.user_metadata));
      return resp.user_metadata;
    } catch (err) {
      return Promise.reject(new Error(err));
    }
  });

export const updateUserMetadata = metadata => {
  localStorage.setItem('user_metadata', JSON.stringify(metadata));
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
